const express = require("express");
const router = express.Router();

const uploadResume = require("../utils/fileUpload");
const resumeController = require("../controllers/resume.controller");

// POST /api/resume/upload
router.post(
  "/upload",
  uploadResume.single("resume"),   // frontend field name = "resume"
  resumeController.uploadResume
);

// GET /api/resume/latest/:studentId
router.get("/latest/:studentId", resumeController.getLatestResumeAnalysis);

module.exports = router;
