const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const studentRoutes = require("./routes/student.routes");
const resumeRoutes = require("./routes/resume.routes");
const roadmapRoutes = require("./routes/roadmap.routes");

require("dotenv").config(); // .env from root

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// DB CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB error:", err));

// static folder for uploaded files (so frontend can access /uploads/..)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
const studentRoutes = require("./routes/student.routes");
const resumeRoutes = require("./routes/resume.routes");
// (baad me: const testRoutes = require("./routes/test.routes"); etc.)

app.use("/api/student", studentRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/roadmap", roadmapRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// (optional, agar kabhi tests likhne ho)
module.exports = app;
