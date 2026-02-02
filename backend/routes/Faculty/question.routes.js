// routes/faculty/question.routes.js
const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/faculty/question.controller');
const { protect } = require('../../middleware/authMiddleware');

// All routes are protected - require authentication
// Create a new question
router.post("/", protect, questionController.createQuestion);

// Get all active questions (filtered by faculty's college)
router.get("/", protect, questionController.getAllQuestions);

// Get question by ID
router.get("/:id", protect, questionController.getQuestionById);

// Get questions by faculty ID
router.get("/faculty/:facultyId", protect, questionController.getQuestionsByFacultyId);

// Get questions by subject
router.get("/subject/:subject", protect, questionController.getQuestionsBySubject);

// Get questions by topic
router.get("/topic/:topic", protect, questionController.getQuestionsByTopic);

// Delete a question
router.delete("/:id", protect, questionController.deleteQuestion);

module.exports = router;