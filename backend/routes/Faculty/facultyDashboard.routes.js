// routes/faculty/facultyDashboard.routes.js
const express = require('express');
const router = express.Router();
const facultyDashboardController = require('../../controllers/faculty/facultyDashboard.controller');

// Get dashboard statistics
router.get("/stats", facultyDashboardController.getDashboardStats);

// Get upcoming tests
router.get("/upcoming-test", facultyDashboardController.getUpcomingTests);

// Get recent tests
router.get("/recentTest", facultyDashboardController.getRecentTests);

module.exports = router;