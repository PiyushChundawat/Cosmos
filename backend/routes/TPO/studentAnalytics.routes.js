// routes/analytics/studentAnalytics.routes.js
const express = require('express');
const router = express.Router();
const studentAnalyticsController = require('../../controllers/TPO/studentAnalytics.controller');
const { protect, requireRole } = require('../../middleware/authMiddleware');

// Segregate students by performance bands
router.get("/performance-bands", protect, requireRole('superadmin', 'collegeadmin'), studentAnalyticsController.getPerformanceBands);

// Get top 5 performing students
router.get("/top-performers", protect, requireRole('superadmin', 'collegeadmin'), studentAnalyticsController.getTopPerformers);

module.exports = router;