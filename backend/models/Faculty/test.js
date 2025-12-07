const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.types.ObjectId,
        required: true
    },
    testTitle: {
        type: String,
        required: true
    },
    questionIds: {
        type: [mongoose.Schema.types.ObjectId],
        required: true
    }, 
    schedule: {
        startTime: Date,
        endTime: Date,
        isScheduled: Boolean
    },
    duration: Number,
    totalMarks: Number,
    createdAt: Date,
    status: String
    }
);

const Test = mongoose.model('Test', testSchema);

