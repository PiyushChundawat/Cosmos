const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    _id: ObjectId,
    facultyId: ObjectId,
    testTitle: String,
    questionIds: [ObjectId], 
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

