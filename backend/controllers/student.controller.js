const Student = require("../models/student.model");
const TestAttempt = require("../models/Student/testAttempt");
const ResumeAnalysis = require("../models/resumeAnalysis.model");
const Roadmap = require("../models/roadmap.model");
const Test = require("../models/Faculty/test");

// GET /api/student/dashboard/:id
exports.getDashboard = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId).lean();
    if (!student) return res.status(404).json({ message: "Student not found" });

    const collegeId = student.collegeId;   // 🔴 key

    const resume = await ResumeAnalysis.findOne({ studentId })
      .sort({ analyzedAt: -1 })
      .lean();

    const roadmap = await Roadmap.findOne({ studentId })
      .sort({ createdAt: -1 })
      .lean();

    // attempts are automatically isolated by studentId,
    // but we also store collegeId in attempt model:
    const attempts = await TestAttempt.find({ studentId, collegeId })
      .populate("testId", "testTitle")
      .sort({ createdAt: -1 })
      .lean();

    const totalTestsTaken = attempts.length;
    const avgScore =
      totalTestsTaken === 0
        ? 0
        : attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalTestsTaken;

    const avgPercentage =
      totalTestsTaken === 0
        ? 0
        : attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) /
          totalTestsTaken;

    const resumeScore = Math.round((avgPercentage / 10) * 10) / 10;

    // 🔴 Upcoming tests FROM SAME COLLEGE ONLY
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
