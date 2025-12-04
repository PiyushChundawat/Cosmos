const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: String,
  subject: String,
  topic: String,
  difficulty: String,

  options: [String],
  correctAnswer: String,

  stats: {
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model("Question", questionSchema);
