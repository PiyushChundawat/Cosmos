const mongoose = require("mongoose");

const weekSchema = new mongoose.Schema(
  {
    weekNumber: Number,
    title: String,
    focusAreas: [String],  // e.g. ["DSA basics", "OS revision"]
    topics: [String],      // detailed topics
    tasks: [String],       // actionable items
    resources: [String],   // links / hints
    status: {
      type: String,
      enum: ["pending", "in-progress", "done"],
      default: "pending",
    },
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    targetRole: { type: String, default: "SDE Intern" },
    durationWeeks: Number,
    generatedFrom: {
      score: Number,
      skills: [String],
      notes: String,
    },
    weeks: [weekSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);
