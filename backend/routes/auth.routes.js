const express = require("express");
const router = express.Router();
const {
  studentLogin,
  facultyLogin,
  adminLogin,
  signup
} = require("../controllers/authController");

// Signup route (common for all roles)
router.post("/signup", signup);

// Teen alag login endpoints
router.post("/student/login", studentLogin);
router.post("/faculty/login", facultyLogin);
router.post("/admin/login", adminLogin);

module.exports = router;
