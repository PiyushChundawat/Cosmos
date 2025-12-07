const express = require('express');
const router = express.Router();
const Question = require('../../models/Faculty/question');

//api to create questions
router.post("/question", async (req, res) => {
    try {
        const {facultyId, questionText, options, correctAnswer, tags} =  req.body;
        
        const newQuestion = await Question.create({
            facultyId, 
            questionText,
            options,
            correctAnswer,
            tags: {
                subject: tags.subject,
                topic: tags.topic
            }
        });
        res.status(201).json({message: "Question submitted successfully"});
    }
    catch(error) {
        res.status(500).json({message: "Error submitting question", error: error.message});
    }
});

// api to get all questions
router.get("/questions", async (req, res) => {
    try {
        const questions = await Question.find({ isActive: true })
            .sort({ createdAt: -1 })
        
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
});

// api to get question by id
router.get("/questions/:id", async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        
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
        // Handle invalid ObjectId
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
});

//api to get question by facultyId
router.get("/questions/faculty/:facultyId", async (req, res) => {
    try {
        const questions = await Question.find({ 
            facultyId: req.params.facultyId,
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
});

//api to get question by subject
router.get("/questions/subject/:subject", async (req, res) => {
    try {
        const subject = req.params.subject;

        const questions = await Question.find({
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
});

//api to get question by topic
router.get("/questions/topic/:topic", async (req, res) => {
    try {
        const topic = req.params.topic;

        const questions = await Question.find({
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
});


// api to delete a question
router.delete("/questions/:id", async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        
        if (!deletedQuestion) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
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
});

module.exports = router;