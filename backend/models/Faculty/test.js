const mongoose = require('mongoose');
const { Schema } = mongoose;

const testSchema = new Schema(
  {
    facultyId: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
     collegeId: {          // 🔴 NEW
      type: Schema.Types.ObjectId,
      ref: 'College',     // ya 'User' / 'Admin'
      required: true,
    },
    testTitle: {
      type: String,
      required: true,
    },
    questionIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
    ],
    schedule: {
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true },
      isScheduled: { type: Boolean, default: true },
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Test = mongoose.model('Test', testSchema);
module.exports = Test;
