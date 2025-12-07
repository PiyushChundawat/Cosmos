const express = require("express");
const router = express.Router();

const { tpoSignup, tpoLogin } = require("../controllers/auth/tpoController");
const { facultySignup, facultyLogin } = require("../controllers/auth/facultyController");
const { studentSignup, studentLogin } = require("../controllers/auth/studentController");

router.post("/tpo/signup", tpoSignup);
router.post("/tpo/login", tpoLogin);

router.post("/faculty/signup", facultySignup);
router.post("/faculty/login", facultyLogin);

router.post("/student/signup", studentSignup);
router.post("/student/login", studentLogin);

module.exports = router;
