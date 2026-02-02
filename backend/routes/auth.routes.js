// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const { tpoSignup, tpoLogin, createPaymentOrder } = require("../controllers/auth/tpoController");
const { facultySignup, facultyLogin } = require("../controllers/auth/facultyController");
const { studentSignup, studentLogin } = require("../controllers/auth/studentController");

// TPO routes
router.post("/tpo/create-payment-order", createPaymentOrder);
router.post("/tpo/signup", tpoSignup);
router.post("/tpo/login", tpoLogin);

// Faculty routes
router.post("/faculty/signup", facultySignup);
router.post("/faculty/login", facultyLogin);

// Student routes
router.post("/student/signup", studentSignup);
router.post("/student/login", studentLogin);

module.exports = router;