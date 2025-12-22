// models/Student/testAttempt.js
const mongoose = require('mongoose');

const TestAttemptSchema = new mongoose.Schema(
    {
        testId: {
            type: mongoose.Schema.Types.ObjectId, // FIXED: was typesObjectId
            ref: 'Test',
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId, // FIXED: was typesObjectId
            ref: 'User',
            required: true
        },
        collegeId: {  // ADD THIS - needed for college isolation
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true
        },
        answers: [{
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question'
            },
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
        },
        facultyFeedback: String,
        submittedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('TestAttempt', TestAttemptSchema);