// routes/faculty/facultyDashboard.routes.js
const express = require('express');
const router = express.Router();
const facultyDashboardController = require('../../controllers/faculty/facultyDashboard.controller');
const { protect } = require('../../middleware/authMiddleware');

// All routes are protected - require authentication and filter by college

// Get dashboard statistics
router.get("/stats", protect, facultyDashboardController.getDashboardStats);

// Get upcoming tests
router.get("/upcoming-test", protect, facultyDashboardController.getUpcomingTests);

// Get recent tests
router.get("/recentTest", protect, facultyDashboardController.getRecentTests);

module.exports = router;