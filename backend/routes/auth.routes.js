const express = require("express");
const router = express.Router();
const {
  studentLogin,
  facultyLogin,
  adminLogin,
} = require("../controllers/authController");

// Teen alag login endpoints
router.post("/student/login", studentLogin);
router.post("/faculty/login", facultyLogin);
router.post("/admin/login", adminLogin);

module.exports = router;
