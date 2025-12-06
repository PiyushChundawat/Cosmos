// Siddhi
const testAttemptSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
  attemptedAt: { type: Date, default: Date.now },
  score: Number,
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selectedOption: String,
      isCorrect: Boolean,
      topic: String
    }
  ],
  topicPerformance: [
    {
      topic: String,
      accuracy: Number,           // 0–1
      level: { type: String, enum: ["weak", "average", "strong"] }
    }
  ]
});
