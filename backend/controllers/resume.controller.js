// controllers/resume.controller.js
const ResumeAnalysis = require("../models/resumeAnalysis.model");
const User = require("../models/user.model");
const { analyzeResumeFromFile } = require("../utils/analyzeResume");

// ---------------------------------------------
// POST /api/resume/upload
// Multer middleware must run before this (adds req.file)
// ---------------------------------------------
const uploadResume = async (req, res) => {
  try {
    // studentId comes from auth middleware (req.user) or body fallback
    const studentId = req.user?._id || req.body.studentId;

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const fileUrl = `/uploads/resumes/${req.file.filename}`;

    // Analyze resume with Claude
    const { score, summary, skills, strengths, improvements, atsKeywords, sectionFeedback } =
      await analyzeResumeFromFile(req.file.path);

    // Save analysis to DB
    const analysis = await ResumeAnalysis.create({
      studentId,
      fileUrl,
      score,
      summary,
      skills,
      strengths,
      improvements,
      atsKeywords: atsKeywords || [],
      sectionFeedback: sectionFeedback || {},
    });

    // Update student's placement readiness score on User model
    await User.findByIdAndUpdate(studentId, {
      placementReadinessScore: score,
    });

    res.status(201).json({
      message: "Resume uploaded and analyzed successfully",
      analysis,
    });
  } catch (err) {
    console.error("Resume upload error:", err);
    res.status(500).json({ message: "Error uploading resume", error: err.message });
  }
};

// ---------------------------------------------
// GET /api/resume/latest/:studentId
// ---------------------------------------------
const getLatestResumeAnalysis = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user?._id;

    const analysis = await ResumeAnalysis.findOne({ studentId })
      .sort({ analyzedAt: -1 })
      .lean();

    if (!analysis) {
      return res.status(404).json({ message: "No resume analysis found for this student" });
    }

    res.json(analysis);
  } catch (err) {
    console.error("Get resume error:", err);
    res.status(500).json({ message: "Error fetching resume analysis", error: err.message });
  }
};

// ---------------------------------------------
// GET /api/resume/history/:studentId  (all past analyses)
// ---------------------------------------------
const getResumeHistory = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user?._id;

    const analyses = await ResumeAnalysis.find({ studentId })
      .sort({ analyzedAt: -1 })
      .lean();

    res.json(analyses);
  } catch (err) {
    console.error("Get resume history error:", err);
    res.status(500).json({ message: "Error fetching resume history", error: err.message });
  }
};

module.exports = {
  uploadResume,
  getLatestResumeAnalysis,
  getResumeHistory,
};