const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

// testing routes
router.post("/", studentController.createStudent);            // new student
router.get("/dashboard/:id", studentController.getDashboard); // dashboard

module.exports = router;
