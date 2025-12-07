// backend/controllers/studentTest.controller.js

const Test = require('../models/test.model');
const Question = require('../models/question.model');
const TestAttempt = require('../models/Student/testAttempt');

// 
// 1) Get all scheduled tests for student
// -------------------------------------------
exports.getUpcomingTests = async (req, res) => {
  try {
    const now = new Date();

    const tests = await Test.find({
      'schedule.isScheduled': true,
      'schedule.startTime': { $gte: now },
      status: 'scheduled'
    }).sort({ 'schedule.startTime': 1 });

    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------
// 2) Get test + questions (no correct answers here)
// -------------------------------------------
exports.getTestForAttempt = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId).lean();

    if (!test) return res.status(404).json({ success: false, message: "Test not found" });

    const questions = await Question.find({ 
      _id: { $in: test.questionIds }, 
      isActive: true 
    }).select("questionText options tags");

    res.status(200).json({
      success: true,
      data: {
        test,
        questions
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------
// 3) SUBMIT ATTEMPT + SCORE CALCULATION
// -------------------------------------------
exports.submitTestAttempt = async (req, res) => {
  try {
    const { studentId, answers } = req.body;
    const { testId } = req.params;

    const test = await Test.findById(testId).lean();
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });

    // Prevent double attempt
    const existing = await TestAttempt.findOne({ testId, studentId });
    if (existing)
      return res.status(400).json({ success: false, message: "Test already attempted." });

    // Get real questions with correct answers
    const questions = await Question.find({ 
      _id: { $in: test.questionIds } 
    }).lean();

    // Map questions
    const map = {};
    questions.forEach(q => map[q._id.toString()] = q);

    // SCORE CALCULATION LOGIC 🔥
    let correct = 0;
    const processed = answers.map(ans => {
      const q = map[ans.questionId];
      const isCorrect = q.correctAnswer === ans.selectedOption;
      if (isCorrect) correct++;
      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect
      };
    });

    const totalQ = questions.length;
    const marksPerQ = test.totalMarks / totalQ;
    const score = correct * marksPerQ;
    const percentage = (score / test.totalMarks) * 100;

    const attempt = await TestAttempt.create({
      studentId,
      testId,
      answers: processed,
      score,
      totalMarks: test.totalMarks,
      percentage,
      status: "completed"
    });

    res.status(201).json({ 
      success: true,
      message: "Test submitted",
      data: attempt
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// -------------------------------------------
// 4) PERFORMANCE DASHBOARD
// -------------------------------------------
exports.getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const attempts = await TestAttempt.find({ studentId })
      .populate("testId", "testTitle")
      .sort({ createdAt: -1 });

    if (!attempts.length) {
      return res.status(200).json({
        success: true,
        data: { attempts: [], resumeScore: 0 }
      });
    }

    const avg = attempts.reduce((a, b) => a + b.percentage, 0) / attempts.length;

    const resumeScore = Math.round((avg / 10) * 10) / 10; // out of 10

    res.status(200).json({
      success: true,
      data: {
        attempts: attempts,
        resumeScore
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};