const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'tp_admin' },

    college: { type: String, required: true },  
    department: { type: String },               
    designation: { type: String, default: 'TPO' },
    phoneNumber: { type: String },              

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);