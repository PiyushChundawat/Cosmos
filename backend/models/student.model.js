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

    placementReadinessScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
