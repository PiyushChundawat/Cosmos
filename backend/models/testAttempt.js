const mongoose = require('mongoose');

const TestAttempts = mongoose.Schema(
    {
        _id: ObjectId,
        testId: ObjectId,
        studentId: ObjectId,
        answers: [{
            questionId: ObjectId,
            selectedOption: String,
            isCorrect: Boolean
        }],
        score: Number,
        totalMarks: Number,
        percentage: Number,
        status: String
    }
);