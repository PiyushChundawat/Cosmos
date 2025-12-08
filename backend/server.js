// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ------------- MIDDLEWARES -------------
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- ROUTES IMPORTS ----------

// AUTH / SUPERADMIN / ADMIN
const authRoutes = require("./routes/auth.routes");
const superAdminRoutes = require("./routes/superAdminRoutes");

let adminRoutes;
try {
  adminRoutes = require("./routes/admin.routes");
} catch (e) {
  console.log("admin.routes.js not found, skipping /api/admin mount");
}

// CORE AUTH-SIDE (faculty / student / questions / tests)
const coreFacultyRoutes = require("./routes/faculty.routes");
const coreStudentRoutes = require("./routes/student.routes");
const coreQuestionRoutes = require("./routes/question.routes");
const coreTestRoutes = require("./routes/test.routes"); // aggregator (Faculty + Student)

// RESUME
const resumeRoutes = require("./routes/resume.routes");

// TPO ANALYTICS
const tpoFacultyAnalyticsRoutes = require("./routes/TPO/facultyAnalytics.routes");
const tpoStudentAnalyticsRoutes = require("./routes/TPO/studentAnalytics.routes");

// FACULTY PANEL
const facultyDashboardRoutes = require("./routes/Faculty/facultyDashboard.routes");
const facultyQuestionRoutes = require("./routes/Faculty/question.routes");
const facultyTestAnalyticsRoutes = require("./routes/Faculty/testAnalytics.routes");
const facultyTestRoutes = require("./routes/Faculty/testRoutes");

// STUDENT PANEL
const studentTestRoutes = require("./routes/Student/testRoutes");

// ------------- BASE TEST ROUTE -------------
app.get("/", (req, res) => {
  res.send("Cosmos backend running 🚀");
});

// ------------- USE ROUTES -------------

// auth + roles
app.use("/api/auth", authRoutes);
app.use("/api/superadmin", superAdminRoutes);

// /api/admin sirf tab mount karo jab sahi router ho
if (typeof adminRoutes === "function") {
  app.use("/api/admin", adminRoutes);
} else if (adminRoutes) {
  console.warn(
    "⚠️ /api/admin not mounted: admin.routes.js must export an Express router (module.exports = router)"
  );
}

// core entities (auth-side)
app.use("/api/faculty", coreFacultyRoutes);      // auth/profile level faculty routes
app.use("/api/student", coreStudentRoutes);      // auth/profile level student routes
app.use("/api/questions", coreQuestionRoutes);   // core question mgmt
app.use("/api/tests", coreTestRoutes);           // core test mgmt (Faculty + Student)

// resume / uploads
app.use("/api/resume", resumeRoutes);

// TPO analytics
app.use("/api/tpo/faculty-analytics", tpoFacultyAnalyticsRoutes);
app.use("/api/tpo/student-analytics", tpoStudentAnalyticsRoutes);

// faculty panel
app.use("/api/faculty/dashboard", facultyDashboardRoutes);
app.use("/api/faculty/questions", facultyQuestionRoutes);
app.use("/api/faculty/test-analytics", facultyTestAnalyticsRoutes);
app.use("/api/faculty/tests", facultyTestRoutes);

// student panel
app.use("/api/student/tests", studentTestRoutes);

// ------------- START SERVER AFTER DB CONNECT -------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("DB error:", err));

// optional (for testing)
module.exports = app;
