const express = require("express");
const router = express.Router();

console.log("✅ auth.routes.js loaded");

const authmiddleware = require("../middleware/authmiddleware")

const {
  studentSignup,
  facultySignup,
  adminSignup,
  studentLogin,
  facultyLogin,
  adminLogin,
} = require("../controllers/authController");

router.post("/student/signup", studentSignup);
router.post("/faculty/signup", facultySignup);
router.post("/admin/signup", adminSignup);

router.post("/student/login", studentLogin);
router.post("/faculty/login", facultyLogin);
router.post("/admin/login", adminLogin);

module.exports = router;