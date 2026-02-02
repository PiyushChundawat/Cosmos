// controllers/faculty/question.controller.js
const Question = require('../../models/Faculty/question');
const User = require('../../models/user.model');

// Create a new question
exports.createQuestion = async (req, res) => {
    try {
        const { questionText, options, correctAnswer, tags } = req.body;
        
        // Get faculty from token (req.user set by protect middleware)
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
        
        const newQuestion = await Question.create({
            facultyId: facultyUser._id,
            collegeId: collegeId,
            questionText,
            options,
            correctAnswer,
            tags: {
                subject: tags.subject,
                topic: tags.topic
            }
        });
        
        res.status(201).json({
            success: true,
            message: "Question submitted successfully",
            data: newQuestion
        });
    }
    catch(error) {
        console.error('Create question error:', error);
        res.status(500).json({
            success: false,
            message: "Error submitting question", 
            error: error.message
        });
    }
};

// Get all active questions for faculty's college
exports.getAllQuestions = async (req, res) => {
    try {
        // Get faculty from token
        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        
        if (!facultyUser || facultyUser.role !== 'faculty') {
            return res.status(403).json({ 
                success: false,
                message: "Unauthorized - Faculty only" 
            });
        }

        const collegeId = facultyUser.college?._id;
        
        if (!collegeId) {
            return res.status(400).json({ 
                success: false,
                message: "Faculty not associated with any college" 
            });
        }

        // Only get questions from faculty's college
        const questions = await Question.find({ 
            collegeId: collegeId,
            isActive: true 
        })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    }
    catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching questions",
            error: error.message
        });
    }
};

// Get question by ID (must be from same college)
exports.getQuestionById = async (req, res) => {
    try {
        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        const collegeId = facultyUser.college?._id;
        
        const question = await Question.findOne({
            _id: req.params.id,
            collegeId: collegeId
        });
        
        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: question
        });
    }
    catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "Invalid question ID"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error fetching question",
            error: error.message
        });
    }
};

// Get questions by faculty ID (from same college)
exports.getQuestionsByFacultyId = async (req, res) => {
    try {
        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        const collegeId = facultyUser.college?._id;
        
        const questions = await Question.find({ 
            facultyId: req.params.facultyId,
            collegeId: collegeId,
            isActive: true 
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching questions",
            error: error.message
        });
    }
};

// Get questions by subject (from same college)
exports.getQuestionsBySubject = async (req, res) => {
    try {
        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        const collegeId = facultyUser.college?._id;
        
        const subject = req.params.subject;

        const questions = await Question.find({
            collegeId: collegeId,
            isActive: true,
            "tags.subject": subject
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching questions by subject",
            error: error.message
        });
    }
};

// Get questions by topic (from same college)
exports.getQuestionsByTopic = async (req, res) => {
    try {
        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        const collegeId = facultyUser.college?._id;
        
        const topic = req.params.topic;

        const questions = await Question.find({
            collegeId: collegeId,
            isActive: true,
            "tags.topic": topic
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching questions by topic",
            error: error.message
        });
    }
};

// Delete a question (must be owned by faculty and from same college)
exports.deleteQuestion = async (req, res) => {
    try {
        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        const collegeId = facultyUser.college?._id;
        
        const deletedQuestion = await Question.findOneAndDelete({
            _id: req.params.id,
            collegeId: collegeId,
            facultyId: facultyUser._id  // Only delete own questions
        });
        
        if (!deletedQuestion) {
            return res.status(404).json({
                success: false,
                message: "Question not found or unauthorized"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Question deleted permanently",
            data: deletedQuestion
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting question",
            error: error.message
        });
    }
};