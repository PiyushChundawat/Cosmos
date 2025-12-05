const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    // ----------- Basic Auth -----------
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'tp_admin' },

    // ----------- College / T&P Info -----------
    college: { type: String, required: true },  // e.g., MNNIT Allahabad
    department: { type: String },               // optional
    designation: { type: String, default: 'TPO' },
    phoneNumber: { type: String },              // optional

    // ----------- Password Reset (ADDED) -----------
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);