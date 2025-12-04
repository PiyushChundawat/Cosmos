const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  name: String,
  subject: String,
  startTime: Date,
  endTime: Date,
  durationMinutes: Number,

  questions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      order: Number
    }
  ],

  stats: {
    totalAttempts: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model("Test", testSchema);
