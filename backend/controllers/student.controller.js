const User = require("../models/user.model");
const TestAttempt = require("../models/Student/testAttempt");
const ResumeAnalysis = require("../models/resumeAnalysis.model");
const Test = require("../models/Faculty/test");
const bcrypt = require("bcryptjs");

// ---------------------------------------------
// CREATE STUDENT (NOT USED - signup uses auth routes)
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
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Student with this email already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      passwordHash: hashedPassword,
      role: "student",
      college: collegeId,
      branch,
      year,
      rollNumber,
      ...rest,
    });
    
    await user.save();
    
    res.status(201).json({
      message: "Student created successfully",
      student: user,
    });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({ message: "Error creating student" });
  }
};

// ---------------------------------------------
// STUDENT DASHBOARD - FIXED TO USE USER MODEL
// ---------------------------------------------
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id; // This comes from protect middleware
    
    // Get the user (student) from User model
    const student = await User.findById(userId).populate('college').lean();
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Get collegeId from the user's college field
    const collegeId = student.college?._id;
    
    if (!collegeId) {
      return res.status(400).json({ message: "Student not associated with any college" });
    }
    
    // Get resume analysis
    const resume = await ResumeAnalysis.findOne({ studentId: userId })
      .sort({ analyzedAt: -1 })
      .lean();
    
    // Get test attempts - using userId as studentId
    const attempts = await TestAttempt.find({ 
      studentId: userId,
      collegeId: collegeId 
    })
      .populate("testId", "testTitle")
      .sort({ createdAt: -1 })
      .lean();
    
    // Calculate stats
    const totalTestsTaken = attempts.length;
    const avgScore =
      totalTestsTaken === 0
        ? 0
        : attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalTestsTaken;
    
    const avgPercentage =
      totalTestsTaken === 0
        ? 0
        : attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalTestsTaken;
    
    // Get upcoming tests for this college
    const now = new Date();
    const upcomingTests = await Test.find({
      collegeId,
      "schedule.isScheduled": true,
      "schedule.startTime": { $gte: now },
      status: "scheduled",
    })
      .sort({ "schedule.startTime": 1 })
      .lean();
    
    // Calculate resume score from attempts average or from resume analysis
    let resumeScore = 0;
    if (resume && resume.score) {
      resumeScore = resume.score / 10; // Convert to scale of 10
    } else if (totalTestsTaken > 0) {
      resumeScore = avgPercentage / 10; // Convert percentage to scale of 10
    }
    
    res.json({
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        college: student.college?.name,
        branch: student.branch,
        year: student.year,
        rollNumber: student.rollNumber,
      },
      resume,
      stats: {
        totalTestsTaken,
        avgScore: Number(avgScore.toFixed(2)),
        avgPercentage: Number(avgPercentage.toFixed(2)),
        resumeScore: Number(resumeScore.toFixed(1)),
      },
      upcomingTests,
      attempts,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Error fetching dashboard", error: err.message });
  }
};