const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware"); // ✅ ADD THIS

// Controllers
const studentController = require("../controllers/student.controller");
const studentTestController = require("../controllers/studentTest.controller");

// PUBLIC (signup)
router.post("/", studentController.createStudent);

// PROTECTED (login ke baad)
router.get("/dashboard/:id", auth, studentController.getDashboard);

router.get(
  "/upcoming-tests/:studentId",
  auth,
  studentTestController.getUpcomingTests
);

router.get("/test/:testId", auth, studentTestController.getTestForAttempt);

router.post(
  "/test/:testId/attempt",
  auth,
  studentTestController.submitTestAttempt
);

router.get(
  "/:studentId/performance",
  auth,
  studentTestController.getStudentPerformance
);

module.exports = router;
