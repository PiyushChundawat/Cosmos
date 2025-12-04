const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  createdAt: { type: Date, default: Date.now },
  status: String,

  weeks: [
    {
      weekNumber: Number,
      topics: [String],
      resources: [String],
      completed: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model("Roadmap", roadmapSchema);
