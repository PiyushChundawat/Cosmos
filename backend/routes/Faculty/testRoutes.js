const express = require('express');
const router = express.Router();
const Test = require('../../models/Faculty/test');
const Question = require('../../models/Faculty/question');
const TestAttempt = require('../../models/Student/testAttempt');
const User = require('../../models/user.model');
const { protect } = require('../../middleware/authMiddleware');

// 🔹 Create a new test (PROTECTED - uses collegeId from token)
router.post('/', protect, async (req, res) => {
  try {
    const {
      testTitle,
      questionIds,
      schedule,
      duration,
      totalMarks,
    } = req.body;

    // Get faculty from token
    const facultyUser = await User.findById(req.user._id).populate('college').lean();
    
    if (!facultyUser || facultyUser.role !== 'faculty') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized - Faculty only',
      });
    }

    const collegeId = facultyUser.college?._id;
    
    if (!collegeId) {
      return res.status(400).json({
        success: false,
        message: 'Faculty not associated with any college',
      });
    }

    if (!testTitle || !questionIds?.length || !schedule || !duration || !totalMarks) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Verify questions belong to same college
    const questions = await Question.find({
      _id: { $in: questionIds },
      collegeId: collegeId,
      isActive: true
    });

    if (questions.length !== questionIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some questions are invalid or not from your college',
      });
    }

    const test = await Test.create({
      facultyId: facultyUser._id,
      collegeId: collegeId,  // Use collegeId from token, not hard-coded
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
    console.error('Create test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test',
      error: error.message,
    });
  }
});

// 🔹 Get all tests by a faculty (PROTECTED - filtered by college)
router.get('/:facultyId', protect, async (req, res) => {
  try {
    const facultyUser = await User.findById(req.user._id).populate('college').lean();
    
    if (!facultyUser || facultyUser.role !== 'faculty') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const collegeId = facultyUser.college?._id;

    const tests = await Test.find({ 
      facultyId: req.params.facultyId,
      collegeId: collegeId  // Only tests from same college
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests,
    });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tests',
      error: error.message,
    });
  }
});

// 🔹 Get a test + its questions + attempts summary (PROTECTED)
router.get('/tests/:testId', protect, async (req, res) => {
  try {
    const facultyUser = await User.findById(req.user._id).populate('college').lean();
    const collegeId = facultyUser.college?._id;

    const test = await Test.findOne({
      _id: req.params.testId,
      collegeId: collegeId
    }).lean();

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    const questions = await Question.find({
      _id: { $in: test.questionIds },
      collegeId: collegeId
    }).lean();

    const attempts = await TestAttempt.find({ 
      testId: test._id,
      collegeId: collegeId
    })
      .populate('studentId', 'name email')
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
    console.error('Get test details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test details',
      error: error.message,
    });
  }
});

// 🔹 Faculty adds feedback to a student's attempt (PROTECTED)
router.post('/tests/:testId/feedback/:studentId', protect, async (req, res) => {
  try {
    const { feedback } = req.body;
    const { testId, studentId } = req.params;

    const facultyUser = await User.findById(req.user._id).populate('college').lean();
    const collegeId = facultyUser.college?._id;

    // Verify test belongs to faculty's college
    const test = await Test.findOne({
      _id: testId,
      collegeId: collegeId
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found or unauthorized',
      });
    }

    const attempt = await TestAttempt.findOne({ 
      testId, 
      studentId,
      collegeId: collegeId
    });

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
    console.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding feedback',
      error: error.message,
    });
  }
});

module.exports = router;