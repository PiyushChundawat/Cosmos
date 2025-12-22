// controllers/faculty/test.controller.js
const mongoose = require('mongoose');
const Test = require('../../models/Faculty/test');
const Question = require('../../models/Faculty/question');
const User = require('../../models/user.model');

// Create a new test
exports.createTest = async (req, res) => {
    try {
        const { testTitle, questionIds, schedule, duration } = req.body;

        // Get faculty from token
        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        
        if (!facultyUser || facultyUser.role !== 'faculty') {
            return res.status(403).json({ 
                message: "Unauthorized - Faculty only" 
            });
        }

        const collegeId = facultyUser.college?._id;
        
        if (!collegeId) {
            return res.status(400).json({ 
                message: "Faculty not associated with any college" 
            });
        }

        // Validation
        if (!testTitle || !questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
            return res.status(400).json({ 
                message: "Missing required fields: testTitle and questionIds are required" 
            });
        }

        // Verify all questions exist, are active, and belong to the same college
        const questions = await Question.find({
            _id: { $in: questionIds },
            collegeId: collegeId,
            isActive: true
        });

        if (questions.length !== questionIds.length) {
            return res.status(400).json({ 
                message: "Some questions are invalid or not from your college" 
            });
        }

        // Calculate total marks (assuming 1 mark per question, adjust as needed)
        const totalMarks = questions.length;

        // Create test object
        const newTest = new Test({
            facultyId: facultyUser._id,
            collegeId: collegeId,
            testTitle,
            questionIds,
            schedule: schedule || {
                startTime: null,
                endTime: null,
                isScheduled: false
            },
            duration: duration || 60, // Default 60 minutes
            totalMarks,
            createdAt: new Date(),
            status: schedule?.isScheduled ? 'scheduled' : 'draft'
        });

        const savedTest = await newTest.save();

        res.status(201).json({
            success: true,
            message: "Test created successfully",
            data: savedTest
        });

    } catch(error) {
        console.error('Create test error:', error);
        res.status(500).json({
            success: false,
            message: "Error creating test",
            error: error.message
        });
    }
};

// Get all tests for faculty's college
exports.getAllTests = async (req, res) => {
    try {
        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        
        if (!facultyUser || facultyUser.role !== 'faculty') {
            return res.status(403).json({ 
                message: "Unauthorized - Faculty only" 
            });
        }

        const collegeId = facultyUser.college?._id;
        
        if (!collegeId) {
            return res.status(400).json({ 
                message: "Faculty not associated with any college" 
            });
        }

        const { status } = req.query;
        
        const filter = {
            collegeId: collegeId,
            facultyId: facultyUser._id  // Only show tests created by this faculty
        };
        
        if (status) filter.status = status;

        const tests = await Test.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Tests retrieved successfully",
            count: tests.length,
            data: tests
        });

    } catch(error) {
        console.error('Get all tests error:', error);
        res.status(500).json({
            success: false,
            message: "Error retrieving tests",
            error: error.message
        });
    }
};

// Get a single test by ID with full question details
exports.getTestById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                message: "Invalid test ID" 
            });
        }

        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        const collegeId = facultyUser.college?._id;

        const test = await Test.findOne({
            _id: id,
            collegeId: collegeId
        });

        if (!test) {
            return res.status(404).json({ 
                message: "Test not found or unauthorized" 
            });
        }

        // Fetch full question details
        const questions = await Question.find({
            _id: { $in: test.questionIds },
            collegeId: collegeId
        }).select('-__v');

        res.status(200).json({
            success: true,
            message: "Test retrieved successfully",
            data: {
                test,
                questions
            }
        });

    } catch(error) {
        console.error('Get test by ID error:', error);
        res.status(500).json({
            success: false,
            message: "Error retrieving test",
            error: error.message
        });
    }
};

// Reschedule a test
exports.rescheduleTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime, isScheduled } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                message: "Invalid test ID" 
            });
        }

        // Validation
        if (!startTime || !endTime) {
            return res.status(400).json({ 
                message: "Both startTime and endTime are required" 
            });
        }

        // Validate dates
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ 
                message: "Invalid date format" 
            });
        }

        if (start >= end) {
            return res.status(400).json({ 
                message: "End time must be after start time" 
            });
        }

        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        const collegeId = facultyUser.college?._id;

        const test = await Test.findOne({
            _id: id,
            collegeId: collegeId,
            facultyId: facultyUser._id
        });

        if (!test) {
            return res.status(404).json({ 
                message: "Test not found or unauthorized" 
            });
        }

        // Update schedule
        test.schedule = {
            startTime: start,
            endTime: end,
            isScheduled: isScheduled !== undefined ? isScheduled : true
        };

        test.status = isScheduled !== false ? 'scheduled' : 'draft';

        const updatedTest = await test.save();

        res.status(200).json({
            success: true,
            message: "Test rescheduled successfully",
            data: updatedTest
        });

    } catch(error) {
        console.error('Reschedule test error:', error);
        res.status(500).json({
            success: false,
            message: "Error rescheduling test",
            error: error.message
        });
    }
};

// Get questions for dropdown (filtered by facultyId and college)
exports.getQuestionsForDropdown = async (req, res) => {
    try {
        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        
        if (!facultyUser || facultyUser.role !== 'faculty') {
            return res.status(403).json({ 
                message: "Unauthorized - Faculty only" 
            });
        }

        const collegeId = facultyUser.college?._id;

        const questions = await Question.find({
            collegeId: collegeId,
            facultyId: facultyUser._id,
            isActive: true
        }).select('_id questionText tags');

        res.status(200).json({
            success: true,
            message: "Questions retrieved successfully",
            count: questions.length,
            data: questions
        });

    } catch(error) {
        console.error('Get questions dropdown error:', error);
        res.status(500).json({
            success: false,
            message: "Error retrieving questions",
            error: error.message
        });
    }
};