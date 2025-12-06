const Roadmap = require("../models/roadmap.model");
const Student = require("../models/student.model");
const ResumeAnalysis = require("../models/resumeAnalysis.model");
const { generateRoadmapWithLLM } = require("../utils/generateRoadmapLLM");

// POST /api/roadmap/generate
const generateRoadmap = async (req, res) => {
  try {
    const { studentId, targetRole } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    const student = await Student.findById(studentId).lean();
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const analysis = await ResumeAnalysis.findOne({ studentId })
      .sort({ analyzedAt: -1 })
      .lean();

    if (!analysis) {
      return res.status(400).json({
        message: "No resume analysis found. Upload & analyse resume first.",
      });
    }

    const context = {
      name: student.name,
      branch: student.branch || "CSE",
      year: student.year || 2,
      score: analysis.score || 0,
      skills: analysis.skills || [],
      strengths: analysis.strengths || [],
      improvements: analysis.improvements || [],
      targetRole: targetRole || "SDE internship / placements",
    };

    const roadmapJson = await generateRoadmapWithLLM(context);

    const roadmap = await Roadmap.create({
      studentId,
      targetRole: context.targetRole,
      durationWeeks: roadmapJson.durationWeeks,
      generatedFrom: {
        score: context.score,
        skills: context.skills,
        notes: "Generated from latest resume analysis",
      },
      weeks: roadmapJson.weeks,
    });

    res.status(201).json({
      message: "Roadmap generated successfully using LLM",
      roadmap,
    });
  } catch (err) {
    console.error("Roadmap generation error:", err);
    res.status(500).json({
      message: "Error generating roadmap",
      error: err.message,
    });
  }
};

// GET /api/roadmap/latest/:studentId
const getLatestRoadmap = async (req, res) => {
  try {
    const { studentId } = req.params;

    const roadmap = await Roadmap.findOne({ studentId })
      .sort({ createdAt: -1 })
      .lean();

    if (!roadmap) {
      return res
        .status(404)
        .json({ message: "No roadmap found for this student" });
    }

    res.json(roadmap);
  } catch (err) {
    console.error("Get roadmap error:", err);
    res.status(500).json({
      message: "Error fetching roadmap",
      error: err.message,
    });
  }
};

module.exports = {
  generateRoadmap,
  getLatestRoadmap,
};
