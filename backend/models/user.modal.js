const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["superadmin","collegeadmin", "faculty", "student"],
      required: true,
    },

    college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },

    department: { type: String },

    regNo: { type: String },

    facultyId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
