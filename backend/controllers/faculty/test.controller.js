// controllers/faculty/test.controller.js
const mongoose = require('mongoose');
const Test = require('../../models/Test');
const Question = require('../../models/Question');

// Create a new test
exports.createTest = async (req, res) => {
    try {
        const { facultyId, testTitle, questionIds, schedule, duration } = req.body;

        // Validation
        if (!facultyId || !testTitle || !questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
            return res.status(400).json({ 
                message: "Missing required fields: facultyId, testTitle, and questionIds are required" 
            });
        }

        // Verify all questions exist and belong to the faculty
        const questions = await Question.find({
            _id: { $in: questionIds },
            facultyId: facultyId,
            isActive: true
        });

        if (questions.length !== questionIds.length) {
            return res.status(400).json({ 
                message: "Some questions are invalid or don't belong to this faculty" 
            });
        }

        // Calculate total marks (assuming 1 mark per question, adjust as needed)
        const totalMarks = questions.length;

        // Create test object
        const newTest = new Test({
            facultyId,
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
            message: "Test created successfully",
            test: savedTest
        });

    } catch(error) {
        res.status(500).json({
            message: "Error creating test",
            error: error.message
        });
    }
};

// Get all tests (with optional filtering by facultyId)
exports.getAllTests = async (req, res) => {
    try {
        const { facultyId, status } = req.query;
        
        const filter = {};
        if (facultyId) filter.facultyId = facultyId;
        if (status) filter.status = status;

        const tests = await Test.find(filter)
            .populate('facultyId', 'name email') // Populate faculty details if needed
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Tests retrieved successfully",
            count: tests.length,
            tests
        });

    } catch(error) {
        res.status(500).json({
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

        const test = await Test.findById(id);

        if (!test) {
            return res.status(404).json({ 
                message: "Test not found" 
            });
        }

        // Fetch full question details
        const questions = await Question.find({
            _id: { $in: test.questionIds }
        }).select('-__v');

        res.status(200).json({
            message: "Test retrieved successfully",
            test: {
                ...test.toObject(),
                questions
            }
        });

    } catch(error) {
        res.status(500).json({
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

        const test = await Test.findById(id);

        if (!test) {
            return res.status(404).json({ 
                message: "Test not found" 
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
            message: "Test rescheduled successfully",
            test: updatedTest
        });

    } catch(error) {
        res.status(500).json({
            message: "Error rescheduling test",
            error: error.message
        });
    }
};

// Get questions for dropdown (filtered by facultyId)
exports.getQuestionsForDropdown = async (req, res) => {
    try {
        const { facultyId } = req.query;

        if (!facultyId) {
            return res.status(400).json({ 
                message: "facultyId is required" 
            });
        }

        const questions = await Question.find({
            facultyId,
            isActive: true
        }).select('_id questionText tags');

        res.status(200).json({
            message: "Questions retrieved successfully",
            count: questions.length,
            questions
        });

    } catch(error) {
        res.status(500).json({
            message: "Error retrieving questions",
            error: error.message
        });
    }
};