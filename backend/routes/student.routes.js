const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

// Controllers
const studentController = require("../controllers/student.controller");
const studentTestController = require("../controllers/studentTest.controller");
const College = require("../models/College.model");
const User = require("../models/user.model");

// PUBLIC
router.post("/", studentController.createStudent);

// IMPORTANT: Specific routes MUST come before dynamic :studentId routes

// Get college codes for authenticated TPO user (PROTECTED) - SPECIFIC ROUTE
router.get("/tpo/college-codes", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('college');
    
    if (!user || !user.college) {
      return res.status(404).json({ message: "College not found for this user" });
    }
    
    res.json({
      success: true,
      data: {
        studentCode: user.college.studentCode,
        facultyCode: user.college.facultyCode,
        collegeName: user.college.name
      }
    });
  } catch (err) {
    console.error('Error fetching TPO college codes:', err);
    res.status(500).json({ message: "Failed to fetch college codes" });
  }
});

// Get college codes by college name (PUBLIC) - SPECIFIC ROUTE
router.get("/college/:collegeName", async (req, res) => {
  try {
    const { collegeName } = req.params;
    const college = await College.findOne({ name: collegeName }).select('studentCode facultyCode');
    
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }
    
    res.json({
      success: true,
      data: {
        studentCode: college.studentCode,
        facultyCode: college.facultyCode
      }
    });
  } catch (err) {
    console.error('Error fetching college codes:', err);
    res.status(500).json({ message: "Failed to fetch college codes" });
  }
});

// PROTECTED - GENERAL ROUTES (COME AFTER SPECIFIC ROUTES)
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
