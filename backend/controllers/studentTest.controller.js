const Test = require("../models/Faculty/test");
const Question = require("../models/Faculty/question");
const TestAttempt = require("../models/Student/testAttempt");
const User = require("../models/user.model");

// 1) Upcoming tests for a student (by college) - FIXED to show active tests too
exports.getUpcomingTests = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get user from User model (not Student model)
    const user = await User.findById(studentId).populate('college').lean();
    
    if (!user || user.role !== 'student') {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const collegeId = user.college?._id;
    
    if (!collegeId) {
      return res.status(400).json({ success: false, message: "Student not associated with college" });
    }

    const now = new Date();

    // FIXED: Show tests that haven't ended yet (both upcoming AND active)
    const tests = await Test.find({
      collegeId: collegeId,
      "schedule.isScheduled": true,
      "schedule.endTime": { $gte: now },  // Changed from startTime to endTime
      status: "scheduled",
    })
      .sort({ "schedule.startTime": 1 })
      .lean();

    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    console.error("getUpcomingTests error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2) Get test for attempt
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
      collegeId: test.collegeId,
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
    console.error("getTestForAttempt error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3) Submit attempt
exports.submitTestAttempt = async (req, res) => {
  try {
    const { studentId, answers } = req.body;
    const { testId } = req.params;

    // Get user from User model
    const user = await User.findById(studentId).populate('college').lean();
    
    if (!user || user.role !== 'student') {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const collegeId = user.college?._id;
    
    if (!collegeId) {
      return res.status(400).json({ success: false, message: "Student not associated with college" });
    }

    const test = await Test.findById(testId).lean();
    
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    // Safety: student must belong to same college as test
    if (String(collegeId) !== String(test.collegeId)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to attempt this test",
      });
    }

    // Check if already attempted
    const existing = await TestAttempt.findOne({
      testId,
      studentId,
      collegeId: collegeId,
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Test already attempted.",
      });
    }

    // Get questions with correct answers
    const questions = await Question.find({
      _id: { $in: test.questionIds },
      collegeId: test.collegeId,
    }).lean();

    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    // Process answers
    let correct = 0;
    const processed = answers.map((ans) => {
      const q = questionMap[ans.questionId];
      
      // Convert selectedOption to number for comparison (frontend sends index)
      const selectedIndex = parseInt(ans.selectedOption);
      const correctIndex = parseInt(q.correctAnswer);
      
      const isCorrect = q && selectedIndex === correctIndex;
      if (isCorrect) correct++;
      
      return {
        questionId: ans.questionId,
        selectedOption: selectedIndex,
        isCorrect,
      };
    });

    // Calculate score
    const totalQ = questions.length || 1;
    const marksPerQ = test.totalMarks / totalQ;
    const score = correct * marksPerQ;
    const percentage = (score / test.totalMarks) * 100;

    // Create attempt
    const attempt = await TestAttempt.create({
      studentId,
      testId,
      collegeId: collegeId,
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
    console.error("submitTestAttempt error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4) Performance
exports.getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get user from User model
    const user = await User.findById(studentId).populate('college').lean();
    
    if (!user || user.role !== 'student') {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const collegeId = user.college?._id;
    
    if (!collegeId) {
      return res.status(400).json({ success: false, message: "Student not associated with college" });
    }

    const attempts = await TestAttempt.find({
      studentId,
      collegeId: collegeId,
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

    // Simple resume score logic: scale avgPercentage to 10
    const resumeScore = Math.round((avgPercentage / 10) * 10) / 10;

    res.status(200).json({
      success: true,
      data: {
        attempts: attempts.map(a => ({
          _id: a._id,
          testId: a.testId?._id,
          testTitle: a.testId?.testTitle,
          score: a.score,
          totalMarks: a.totalMarks,
          percentage: a.percentage,
          facultyFeedback: a.facultyFeedback,
          createdAt: a.createdAt,
          attemptedAt: a.createdAt,
        })),
        resumeScore,
      },
    });
  } catch (error) {
    console.error("getStudentPerformance error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};