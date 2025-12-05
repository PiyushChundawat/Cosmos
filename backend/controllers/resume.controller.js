const ResumeAnalysis = require("../models/resumeAnalysis.model");
const Student = require("../models/student.model");
const { analyzeResumeFromFile } = require("../utils/analyzeResume");

// POST /api/resume/upload
const uploadResume = async (req, res) => {
  try {
    const studentId = req.body.studentId;

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const fileUrl = `/uploads/resumes/${req.file.filename}`;

    // 🔥 LLM-based analysis via HuggingFace
    const { score, skills, strengths, improvements, summary } =
      await analyzeResumeFromFile(req.file.path);

    const analysis = await ResumeAnalysis.create({
      studentId,
      fileUrl,
      score,
      summary,
      skills,
      strengths,
      improvements,
    });

    await Student.findByIdAndUpdate(studentId, {
      placementReadinessScore: score,
    });

    res.status(201).json({
      message: "Resume uploaded and analyzed with LLM (HuggingFace)",
      analysis,
    });
  } catch (err) {
    console.error("Resume upload error:", err);
    res
      .status(500)
      .json({ message: "Error uploading resume", error: err.message });
  }
};

// GET /api/resume/latest/:studentId
const getLatestResumeAnalysis = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const analysis = await ResumeAnalysis.findOne({ studentId })
      .sort({ analyzedAt: -1 })
      .lean();

    if (!analysis) {
      return res
        .status(404)
        .json({ message: "No resume analysis found for this student" });
    }

    res.json(analysis);
  } catch (err) {
    console.error("Get resume error:", err);
    res
      .status(500)
      .json({ message: "Error fetching resume analysis", error: err.message });
  }
};

module.exports = {
  uploadResume,
  getLatestResumeAnalysis,
};
