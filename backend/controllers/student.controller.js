const Student = require("../models/student.model");
const TestAttempt = require("../models/Student/testAttempt");
const ResumeAnalysis = require("../models/resumeAnalysis.model");

const Test = require("../models/Faculty/test");
const bcrypt = require("bcryptjs");

// POST /api/student/create  (route tum jaisa chaaho waise rakho)
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

    // already registered?
    const existing = await Student.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Student with this email already exists" });
    }

    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      email,
      password: hashedPassword,
      collegeId,
      branch,
      year,
      rollNumber,
      ...rest, // agar schema me aur fields hon to bhi aa jayenge
    });

    await student.save();

    return res.status(201).json({
      message: "Student created successfully",
      student,
    });
  } catch (err) {
    console.error("Error creating student:", err);
    return res.status(500).json({ message: "Error creating student" });
  }
};

// GET /api/student/dashboard/:id
exports.getDashboard = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId).lean();
    if (!student) return res.status(404).json({ message: "Student not found" });

    const collegeId = student.collegeId; // 🔴 key

    const resume = await ResumeAnalysis.findOne({ studentId })
      .sort({ analyzedAt: -1 })
      .lean();

    const roadmap = await Roadmap.findOne({ studentId })
      .sort({ createdAt: -1 })
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

    const resumeScore = Math.round((avgPercentage / 10) * 10) / 10;

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
      roadmap,
      stats: { totalTestsTaken, avgScore, avgPercentage, resumeScore },
      upcomingTests,
      attempts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dashboard" });
  }
};
