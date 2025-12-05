const Student = require("../models/student.model");
const TestAttempt = require("../models/testAttempt.model");
const ResumeAnalysis = require("../models/resumeAnalysis.model");
const Roadmap = require("../models/roadmap.model");

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

    const student = await Student.findById(studentId).lean();
    if (!student) return res.status(404).json({ message: "Student not found" });

    const resume = await ResumeAnalysis.findOne({ studentId }).sort({ analyzedAt: -1 }).lean();
    const attempts = await TestAttempt.find({ studentId }).sort({ attemptedAt: -1 }).lean();
    const roadmap = await Roadmap.findOne({ studentId }).sort({ createdAt: -1 }).lean();

    const totalTestsTaken = attempts.length;
    const avgScore =
      totalTestsTaken === 0
        ? 0
        : attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalTestsTaken;

    res.json({
      student,
      resume,
      stats: { totalTestsTaken, avgScore },
      roadmap
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dashboard" });
  }
};
