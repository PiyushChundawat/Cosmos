// models/resumeAnalysis.model.js
const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    summary: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    atsKeywords: {
      type: [String],
      default: [],
    },
    sectionFeedback: {
      contact: { type: String, default: null },
      summary: { type: String, default: null },
      experience: { type: String, default: null },
      education: { type: String, default: null },
      skills: { type: String, default: null },
      projects: { type: String, default: null },
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);