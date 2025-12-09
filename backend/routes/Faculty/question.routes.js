// routes/faculty/question.routes.js
const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/faculty/question.controller');

// Create a new question
router.post("/", questionController.createQuestion);

// Get all active questions
router.get("/", questionController.getAllQuestions);

// Get question by ID
router.get("//:id", questionController.getQuestionById);

// Get questions by faculty ID
router.get("/faculty/:facultyId", questionController.getQuestionsByFacultyId);

// Get questions by subject
router.get("/subject/:subject", questionController.getQuestionsBySubject);

// Get questions by topic
router.get("/topic/:topic", questionController.getQuestionsByTopic);

// Delete a question
router.delete("/:id", questionController.deleteQuestion);

module.exports = router;