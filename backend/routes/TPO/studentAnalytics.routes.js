// routes/analytics/studentAnalytics.routes.js
const express = require('express');
const router = express.Router();
const studentAnalyticsController = require('../../controllers/analytics/studentAnalytics.controller');

// Segregate students by performance bands
router.get("/performance-bands", studentAnalyticsController.getPerformanceBands);

// Get top 5 performing students
router.get("/top-performers", studentAnalyticsController.getTopPerformers);

module.exports = router;