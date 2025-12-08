const mongoose = require('mongoose');
const { Schema } = mongoose;

const testAttemptSchema = new Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    collegeId: {                
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        selectedOption: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'completed',
    },
    facultyFeedback: {
      type: String, // overall feedback for that test attempt
    },
  },
  {
    timestamps: true,
  }
);

const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);
module.exports = TestAttempt;
