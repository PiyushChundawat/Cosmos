const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    passwordHash: String,

    college: String,
    branch: String,
    year: Number,
    section: String,
    rollNumber: String,
    collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",      // ya "User" / "Admin" jo bhi tum use kar rahi ho
    required: true
  },

    placementReadinessScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
