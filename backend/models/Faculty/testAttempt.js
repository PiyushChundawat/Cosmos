const mongoose = require('mongoose');

const TestAttempts = mongoose.Schema(
    {
        testId: {
            type: mongoose.Schema.typesObjectId,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        studentId: {
            type: mongoose.Schema.typesObjectId,
            required: true
        },
        answers: [{
            questionId: mongoose.Schema.ObjectId,
            selectedOption: String,
            isCorrect: Boolean
        }],
        score: {
            type: Number,
            required: true
        },
        totalMarks: {
            type: Number,
            required: true
        },
        percentage: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    }
);