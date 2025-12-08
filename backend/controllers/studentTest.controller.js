const Test = require("../models/Faculty/test");
const Question = require("../models/Faculty/question");

const TestAttempt = require("../models/Student/testAttempt");
const Student = require("../models/student.model");

// 1) Upcoming tests for a student (by college)
exports.getUpcomingTests = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).lean();
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const now = new Date();

    const tests = await Test.find({
      collegeId: student.collegeId,            // 🔴 same college
      "schedule.isScheduled": true,
      "schedule.startTime": { $gte: now },
      status: "scheduled",
    })
      .sort({ "schedule.startTime": 1 })
      .lean();

    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2) Get test for attempt (no change except it's already filtered when listing)
exports.getTestForAttempt = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId).lean();
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    const questions = await Question.find({
      _id: { $in: test.questionIds },
      isActive: true,
      collegeId: test.collegeId,              // 🔴 ensure same college questions
    })
      .select("questionText options tags")
      .lean();

    res.status(200).json({
      success: true,
      data: {
        test,
        questions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3) Submit attempt
exports.submitTestAttempt = async (req, res) => {
  try {
    const { studentId, answers } = req.body;
    const { testId } = req.params;

    const student = await Student.findById(studentId).lean();
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const test = await Test.findById(testId).lean();
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    // 🔴 safety: student must belong to same college as test
    if (String(student.collegeId) !== String(test.collegeId)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to attempt this test",
      });
    }

    const existing = await TestAttempt.findOne({
      testId,
      studentId,
      collegeId: student.collegeId,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Test already attempted.",
      });
    }

    const questions = await Question.find({
      _id: { $in: test.questionIds },
      collegeId: test.collegeId,
    }).lean();

    const map = {};
    questions.forEach((q) => {
      map[q._id.toString()] = q;
    });

    let correct = 0;
    const processed = answers.map((ans) => {
      const q = map[ans.questionId];
      const isCorrect = q && q.correctAnswer === ans.selectedOption;
      if (isCorrect) correct++;
      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
      };
    });

    const totalQ = questions.length || 1;
    const marksPerQ = test.totalMarks / totalQ;
    const score = correct * marksPerQ;
    const percentage = (score / test.totalMarks) * 100;

    const attempt = await TestAttempt.create({
      studentId,
      testId,
      collegeId: student.collegeId,      // 🔴 store collegeId
      answers: processed,
      score,
      totalMarks: test.totalMarks,
      percentage,
      status: "completed",
    });

    res.status(201).json({
      success: true,
      message: "Test submitted",
      data: attempt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4) Performance
exports.getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).lean();
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const attempts = await TestAttempt.find({
      studentId,
      collegeId: student.collegeId,
    })
      .populate("testId", "testTitle")
      .sort({ createdAt: -1 })
      .lean();

    if (!attempts.length) {
      return res.status(200).json({
        success: true,
        data: { attempts: [], resumeScore: 0 },
      });
    }

    const avgPercentage =
      attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) /
      attempts.length;

    const resumeScore = Math.round((avgPercentage / 10) * 10) / 10;

    res.status(200).json({
      success: true,
      data: {
        attempts,
        resumeScore,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
