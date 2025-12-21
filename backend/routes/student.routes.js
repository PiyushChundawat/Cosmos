const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

// Controllers
const studentController = require("../controllers/student.controller");
const studentTestController = require("../controllers/studentTest.controller");

// PUBLIC
router.post("/", studentController.createStudent);

// PROTECTED
router.get("/dashboard", protect, studentController.getDashboard);

router.get(
  "/upcoming-tests/:studentId",
  protect,
  studentTestController.getUpcomingTests
);

router.get(
  "/test/:testId",
  protect,
  studentTestController.getTestForAttempt
);

router.post(
  "/test/:testId/attempt",
  protect,
  studentTestController.submitTestAttempt
);

router.get(
  "/:studentId/performance",
  protect,
  studentTestController.getStudentPerformance
);

module.exports = router;
