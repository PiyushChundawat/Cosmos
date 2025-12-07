// routes/analytics/testAnalytics.routes.js
const express = require('express');
const router = express.Router();
const testAnalyticsController = require('../../controllers/analytics/testAnalytics.controller');

// Get test summary for a specific test
router.get("/test-summary/:testId", testAnalyticsController.getTestSummary);

// Get question-wise statistics for a test
router.get("/question-stats/:testId", testAnalyticsController.getQuestionStats);

// Get average test scores for all tests by faculty
router.get("/all-tests-summary", testAnalyticsController.getAllTestsSummary);

// Get top 5 and worst 5 performing students for a test
router.get("/student-performance/:testId", testAnalyticsController.getStudentPerformance);

module.exports = router;