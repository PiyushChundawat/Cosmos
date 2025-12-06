const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

// ROUTES
const studentRoutes = require("./routes/student.routes");
const resumeRoutes = require("./routes/resume.routes");
const roadmapRoutes = require("./routes/roadmap.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const facultyRoutes = require("./routes/faculty.routes");
const testRoutes = require("./routes/test.routes");
const questionRoutes = require("./routes/question.routes");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,        // during dev: frontend origin (e.g. http://localhost:5173)
    credentials: true,
  })
);

// static folder for uploaded resumes (frontend can read /uploads/..)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.use("/api/student", studentRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/test", testRoutes);
app.use("/api/question", questionRoutes);

// health route
app.get("/", (req, res) => {
  res.send("COSMOS backend running");
});

// DB + SERVER
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.DB_URL;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = app;
