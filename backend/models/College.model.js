
// models/College.js
const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },

    // e.g. "mnnit.ac.in"
    emailDomain: { type: String, required: true },

    // TPO info
    tpoName: { type: String, required: true },
    tpoEmail: { type: String, required: true },
    tpoPhone: { type: String },

    address: { type: String },

    // Codes that TPO will share
    studentCode: { type: String, required: true, unique: true },
    facultyCode: { type: String, required: true, unique: true },

    // Subscription info
    subscription: {
      amountPaid: { type: Number, default: 0 },
      plan: { type: String, default: "dummy" },
      startedAt: { type: Date },
      expiresAt: { type: Date },
      isActive: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);
