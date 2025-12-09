const express = require('express');
const router = express.Router();
const Test = require('../../models/Faculty/test');
const Question = require('../../models/Faculty/question');
const TestAttempt = require('../../models/Student/testAttempt');

// 🔹 Create a new test
router.post('/', async (req, res) => {
  try {
    const {
      facultyId,
      testTitle,
      questionIds,
      schedule,
      duration,
      totalMarks,
    } = req.body;

    if (!facultyId || !testTitle || !questionIds?.length || !schedule || !duration || !totalMarks) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const test = await Test.create({
      facultyId,
      collegeId: "675a1234567890abcdef5678", 
      testTitle,
      questionIds,
      schedule,
      duration,
      totalMarks,
      status: 'scheduled',
    });

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating test',
      error: error.message,
    });
  }
});

// 🔹 Get all tests by a faculty
router.get('/:facultyId', async (req, res) => {
  try {
    const tests = await Test.find({ facultyId: req.params.facultyId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tests',
      error: error.message,
    });
  }
});

// 🔹 Get a test + its questions + attempts summary
router.get('/tests/:testId', async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId).lean();
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    const questions = await Question.find({
      _id: { $in: test.questionIds },
    }).lean();

    const attempts = await TestAttempt.find({ testId: test._id })
      .populate('studentId', 'name email') // adjust fields as per your Student model
      .lean();

    res.status(200).json({
      success: true,
      data: {
        test,
        questions,
        attempts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching test details',
      error: error.message,
    });
  }
});

// 🔹 Faculty adds feedback to a student's attempt
router.post('/tests/:testId/feedback/:studentId', async (req, res) => {
  try {
    const { feedback } = req.body;
    const { testId, studentId } = req.params;

    const attempt = await TestAttempt.findOne({ testId, studentId });
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found for this student and test',
      });
    }

    attempt.facultyFeedback = feedback;
    await attempt.save();

    res.status(200).json({
      success: true,
      message: 'Feedback added successfully',
      data: attempt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding feedback',
      error: error.message,
    });
  }
});

module.exports = router;