const Student = require("../models/student.model");
const TestAttempt = require("../models/Student/testAttempt");   // ⬅ path fix
const ResumeAnalysis = require("../models/resumeAnalysis.model");

const Test = require("../models/Faculty/test");                  // ⬅ new import

// POST /api/student  -> create dummy student (for now)
exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating student" });
  }
};

// GET /api/student/dashboard/:id
exports.getDashboard = async (req, res) => {
  try {
    const studentId = req.params.id;

    // 1) Basic student data
    const student = await Student.findById(studentId).lean();
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2) Latest resume analysis
    const resume = await ResumeAnalysis.findOne({ studentId })
      .sort({ analyzedAt: -1 })        // ya createdAt, jo bhi tumhare schema me hai
      .lean();

    // 3) Roadmap (latest)
   

    // 4) Test attempts (+ test title)
    const attempts = await TestAttempt.find({ studentId })
      .populate("testId", "testTitle") // so frontend can show test name
      .sort({ createdAt: -1 })         // timestamps se sort
      .lean();

    const totalTestsTaken = attempts.length;
    const avgScore =
      totalTestsTaken === 0
        ? 0
        : attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalTestsTaken;

    // optional: avg percentage se resumeScore (0–10)
    const avgPercentage =
      totalTestsTaken === 0
        ? 0
        : attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) /
          totalTestsTaken;

    const resumeScore = Math.round((avgPercentage / 10) * 10) / 10;

    // 5) Upcoming tests (for dashboard "Scheduled tests" section)
    const now = new Date();
    const upcomingTests = await Test.find({
      "schedule.isScheduled": true,
      "schedule.startTime": { $gte: now },
      status: "scheduled",
    })
      .sort({ "schedule.startTime": 1 })
      .lean();

    // FINAL RESPONSE
    res.json({
      student,
      resume,
      roadmap,
      stats: {
        totalTestsTaken,
        avgScore,
        avgPercentage,
        resumeScore,
      },
      upcomingTests,
      attempts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dashboard" });
  }
};
