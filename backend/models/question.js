const mongoose = require('mongoose');

const questionSchema = mongoose.Schema(
    {
        _id: ObjectId,
        facultyId: ObjectId,
        questionText: String,
        options: [String],
        correctAnswer: String,
        tags: {
            subject: String,
            topic: String
        },
        createdAt: Date
    }
);

const Question = mongoose.model('Question', questionSchema);

