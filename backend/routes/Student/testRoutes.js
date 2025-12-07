const express = require('express');
const router = express.Router();
const Test = require('../../models/Faculty/test');
const Question = require('../../models/Faculty/question');
const TestAttempt = require('../../models/Student/testAttempt');

// 🔹 1. Get all scheduled tests for a student (dashboard list)
router.get('/student/:studentId/tests', async (req, res) => {
  try {
    const now = new Date();

    // abhi simple: saare scheduled tests dikha rahe,
    // baad me yahan branch/semester/college filter laga sakte ho.
    const tests = await Test.find({
      'schedule.isScheduled': true,
      'schedule.startTime': { $gte: now }, // upcoming
      status: { $in: ['scheduled'] },
    })
      .sort({ 'schedule.startTime': 1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tests for student',
      error: error.message,
    });
  }
});

// 🔹 2. Get one test details + questions (without correctAnswer) for attempt page
router.get('/student/tests/:testId', async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId).lean();

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    // test ke saare questions fetch karo
    const questions = await Question.find({
      _id: { $in: test.questionIds },
      isActive: true,
    })
      .select('questionText options tags') // IMPORTANT: no correctAnswer for student
      .lean();

    res.status(200).json({
      success: true,
      data: {
        test: {
          _id: test._id,
          testTitle: test.testTitle,
          schedule: test.schedule,
          duration: test.duration,
          totalMarks: test.totalMarks,
          status: test.status,
        },
        questions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching test for student',
      error: error.message,
    });
  }
});

// 🔹 3. Student submits test attempt
router.post('/student/tests/:testId/attempt', async (req, res) => {
  try {
    const { studentId, answers } = req.body;
    const { testId } = req.params;

    if (!studentId || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'studentId and answers are required',
      });
    }

    const test = await Test.findById(testId).lean();
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    // Prevent multiple attempts if you want
    const existingAttempt = await TestAttempt.findOne({ testId, studentId });
    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        message: 'Test already attempted by this student',
      });
    }

    // Fetch all questions of this test (with correctAnswer)
    const questions = await Question.find({
      _id: { $in: test.questionIds },
    }).lean();

    // Map questionId -> correctAnswer
    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    let correctCount = 0;
    const processedAnswers = answers.map((ans) => {
      const q = questionMap[ans.questionId];
      const isCorrect =
        q && ans.selectedOption === q.correctAnswer ? true : false;

      if (isCorrect) correctCount++;

      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
      };
    });

    const totalQuestions = questions.length || 1;
    const totalMarks = test.totalMarks || totalQuestions;
    const marksPerQuestion = totalMarks / totalQuestions;
    const score = correctCount * marksPerQuestion;
    const percentage = (score / totalMarks) * 100;

    const attempt = await TestAttempt.create({
      testId,
      studentId,
      answers: processedAnswers,
      score,
      totalMarks,
      percentage,
      status: 'completed',
    });

    res.status(201).json({
      success: true,
      message: 'Test submitted successfully',
      data: attempt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting test',
      error: error.message,
    });
  }
});

// 🔹 4. Student dashboard – all attempts + feedback + “resume score”
router.get('/student/:studentId/performance', async (req, res) => {
  try {
    const { studentId } = req.params;

    const attempts = await TestAttempt.find({ studentId })
      .populate('testId', 'testTitle')
      .sort({ createdAt: -1 })
      .lean();

    if (!attempts.length) {
      return res.status(200).json({
        success: true,
        message: 'No attempts found',
        data: {
          attempts: [],
          resumeScore: 0,
        },
      });
    }

    const avgPercentage =
      attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) /
      attempts.length;

    // Simple resume score logic: scale avgPercentage to 10
    const resumeScore = Math.round((avgPercentage / 10) * 10) / 10; // 0–10 with 1 decimal

    res.status(200).json({
      success: true,
      data: {
        attempts: attempts.map((a) => ({
          testId: a.testId._id,
          testTitle: a.testId.testTitle,
          score: a.score,
          totalMarks: a.totalMarks,
          percentage: a.percentage,
          facultyFeedback: a.facultyFeedback,
          attemptedAt: a.createdAt,
        })),
        resumeScore,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student performance',
      error: error.message,
    });
  }
});

module.exports = router;
