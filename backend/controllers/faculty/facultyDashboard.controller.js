// controllers/faculty/facultyDashboard.controller.js
const Test = require('../../models/Faculty/test');
const TestAttempt = require('../../models/Student/testAttempt'); // Adjusted to match your model name

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const totalTest = await Test.find();
        const scores = await TestAttempt.find({}).select({ score: 1, _id: 0 });
        const totalScore = scores.reduce((acc, obj) => acc + obj.score, 0);
        const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
        const upcomingTest = await Test.find({ "schedule.isScheduled": true }).select("testTitle");
        
        res.status(200).json({
            success: true,
            countTotal: totalTest.length,
            averageTestScore: averageScore,
            upcomingTestCount: upcomingTest.length
        });
    } catch(error) {
        res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
    }
};

// Get upcoming tests
exports.getUpcomingTests = async (req, res) => {
    try {
        const upTest = await Test.find({
            "schedule.isScheduled": true
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: upTest.length,
            data: upTest
        });
    } catch(error) {
        res.status(500).json({ message: "Error fetching upcoming tests", error: error.message });
    }
};

// Get recent tests
exports.getRecentTests = async (req, res) => {
    try {
        const recentTest = await Test.find()
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.status(200).json({
            success: true,
            data: recentTest
        });
    } catch(error) {
        res.status(500).json({ message: "Error fetching recent tests", error: error.message });
    }
};