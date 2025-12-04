const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  analyzedAt: { type: Date, default: Date.now },
  score: Number,
  summary: String,
  skills: [String],
  fileUrl: String
});

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
