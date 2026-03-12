// routes/resume.routes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect } = require("../middleware/auth.middleware"); // your existing auth middleware
const {
  uploadResume,
  getLatestResumeAnalysis,
  getResumeHistory,
} = require("../controllers/resume.controller");

const router = express.Router();

// ---------------------------------------------
// MULTER CONFIG — saves to /uploads/resumes/
// ---------------------------------------------
const uploadDir = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// ---------------------------------------------
// ROUTES
// ---------------------------------------------
router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/latest/:studentId", protect, getLatestResumeAnalysis);
router.get("/history/:studentId", protect, getResumeHistory);

module.exports = router;