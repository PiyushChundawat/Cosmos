const Student = require("../models/student.model");
const TestAttempt = require("../models/Student/testAttempt");
const ResumeAnalysis = require("../models/resumeAnalysis.model");
const Test = require("../models/Faculty/test");
const bcrypt = require("bcryptjs");

// ---------------------------------------------
// CREATE STUDENT
// ---------------------------------------------
exports.createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      collegeId,
      branch,
      year,
      rollNumber,
      ...rest
    } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Student with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      email,
      passwordHash: hashedPassword, // ✅ FIX
      collegeId,
      branch,
      year,
      rollNumber,
      ...rest,
    });

    await student.save();

    res.status(201).json({
      message: "Student created successfully",
      student,
    });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({ message: "Error creating student" });
  }
};

// ---------------------------------------------
// STUDENT DASHBOARD
// ---------------------------------------------
exports.getDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    const student = await Student.findById(studentId).lean();
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const collegeId = student.collegeId;

    const resume = await ResumeAnalysis.findOne({ studentId })
      .sort({ analyzedAt: -1 })
      .lean();

    const attempts = await TestAttempt.find({ studentId, collegeId })
      .populate("testId", "testTitle")
      .sort({ createdAt: -1 })
      .lean();

    const totalTestsTaken = attempts.length;

    const avgScore =
      totalTestsTaken === 0
        ? 0
        : attempts.reduce((sum, a) => sum + (a.score || 0), 0) /
          totalTestsTaken;

    const avgPercentage =
      totalTestsTaken === 0
        ? 0
        : attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) /
          totalTestsTaken;

    const now = new Date();
    const upcomingTests = await Test.find({
      collegeId,
      "schedule.isScheduled": true,
      "schedule.startTime": { $gte: now },
      status: "scheduled",
    })
      .sort({ "schedule.startTime": 1 })
      .lean();

    res.json({
      student,
      resume,
      stats: {
        totalTestsTaken,
        avgScore,
        avgPercentage,
        resumeScore: student.placementReadinessScore || 0,
      },
      upcomingTests,
      attempts,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Error fetching dashboard" });
  }
};
