// routes/faculty/question.routes.js
const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/faculty/question.controller');

// Create a new question
router.post("/question", questionController.createQuestion);

// Get all active questions
router.get("/questions", questionController.getAllQuestions);

// Get question by ID
router.get("/questions/:id", questionController.getQuestionById);

// Get questions by faculty ID
router.get("/questions/faculty/:facultyId", questionController.getQuestionsByFacultyId);

// Get questions by subject
router.get("/questions/subject/:subject", questionController.getQuestionsBySubject);

// Get questions by topic
router.get("/questions/topic/:topic", questionController.getQuestionsByTopic);

// Delete a question
router.delete("/questions/:id", questionController.deleteQuestion);

module.exports = router;