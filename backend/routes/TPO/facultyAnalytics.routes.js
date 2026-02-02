// routes/analytics/facultyAnalytics.routes.js
const express = require('express');
const router = express.Router();
const facultyAnalyticsController = require('../../controllers/TPO/facultyAnalytics.controller');
const { protect, requireRole } = require('../../middleware/authMiddleware');

// Get performance bands by faculty/subject
router.get("/performance-bands", protect, requireRole('superadmin', 'collegeadmin', 'tpo'), facultyAnalyticsController.getPerformanceBands);

// Get complete faculty analytics with average scores
router.get("/complete", protect, requireRole('superadmin', 'collegeadmin', 'tpo'), facultyAnalyticsController.getCompleteAnalytics);

module.exports = router;