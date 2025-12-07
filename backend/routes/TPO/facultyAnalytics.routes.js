// routes/analytics/facultyAnalytics.routes.js
const express = require('express');
const router = express.Router();
const facultyAnalyticsController = require('../../controllers/analytics/facultyAnalytics.controller');

// Get performance bands by faculty/subject
router.get("/performance-bands", facultyAnalyticsController.getPerformanceBands);

// Get complete faculty analytics with average scores
router.get("/complete", facultyAnalyticsController.getCompleteAnalytics);

module.exports = router;