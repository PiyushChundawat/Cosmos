const express = require("express");
const router = express.Router();

// Student Dashboard Controller
const studentController = require("../controllers/student.controller");

// Student Test Controller (NEW)
const studentTestController = require("../controllers/studentTest.controller");

// ---------------------------------------------
// STUDENT PROFILE / DASHBOARD ROUTES
// ---------------------------------------------
router.post("/", studentController.createStudent);
router.get("/dashboard/:id", studentController.getDashboard);

// ---------------------------------------------
// STUDENT TEST SYSTEM ROUTES (IMPORTANT)
// ---------------------------------------------

// 1) UPCOMING TESTS LIST
router.get("/:studentId/upcoming-tests", studentTestController.getUpcomingTests);

// 2) ONE TEST + QUESTIONS FOR ATTEMPT
router.get("/test/:testId", studentTestController.getTestForAttempt);

// 3) STUDENT SUBMITS ATTEMPT
router.post("/test/:testId/attempt", studentTestController.submitTestAttempt);

// 4) STUDENT PERFORMANCE (attempts + resumeScore + feedback)
router.get("/:studentId/performance", studentTestController.getStudentPerformance);

module.exports = router;
