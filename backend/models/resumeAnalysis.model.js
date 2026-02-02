const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  analyzedAt: { type: Date, default: Date.now },
  score: Number,
  summary: String,
  skills: [String],
  strengths: [String],        // ✅ ADD
  improvements: [String],     // ✅ ADD
  fileUrl: String
});

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
