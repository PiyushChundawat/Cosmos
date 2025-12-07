// backend/routes/test.routes.js
const express = require('express');
const router = express.Router();

const facultyTestRoutes = require('./Faculty/testRoutes');
const studentTestRoutes = require('./Student/testRoutes');

// sab faculty APIs: /api/tests/faculty/...
router.use('/faculty', facultyTestRoutes);

// sab student APIs: /api/tests/student/...
router.use('/', studentTestRoutes);

module.exports = router;
