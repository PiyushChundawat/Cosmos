// controllers/faculty/facultyDashboard.controller.js
const Test = require('../../models/Faculty/test');
const TestAttempt = require('../../models/Student/testAttempt');
const User = require('../../models/user.model');

// Get dashboard statistics (filtered by college)
exports.getDashboardStats = async (req, res) => {
    try {
        // Get faculty from token
        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        
        if (!facultyUser || facultyUser.role !== 'faculty') {
            return res.status(403).json({ 
                success: false,
                message: "Unauthorized - Faculty only" 
            });
        }

        const collegeId = facultyUser.college?._id;
        
        if (!collegeId) {
            return res.status(400).json({ 
                success: false,
                message: "Faculty not associated with any college" 
            });
        }

        // Get tests created by this faculty in their college
        const totalTest = await Test.find({ 
            collegeId: collegeId,
            facultyId: facultyUser._id 
        });
        
        // Get scores from test attempts for this faculty's tests
        const testIds = totalTest.map(t => t._id);
        const scores = await TestAttempt.find({ 
            testId: { $in: testIds },
            collegeId: collegeId 
        }).select({ score: 1, _id: 0 });
        
        const totalScore = scores.reduce((acc, obj) => acc + obj.score, 0);
        const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
        
        // Get upcoming tests for this faculty
        const now = new Date();
        const upcomingTest = await Test.find({ 
            collegeId: collegeId,
            facultyId: facultyUser._id,
            "schedule.isScheduled": true,
            "schedule.endTime": { $gte: now }
        }).select("testTitle");
        
        res.status(200).json({
            success: true,
            countTotal: totalTest.length,
            averageTestScore: Math.round(averageScore),
            upcomingTestCount: upcomingTest.length
        });
    } catch(error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching dashboard stats", 
            error: error.message 
        });
    }
};

// Get upcoming tests (filtered by college and faculty)
exports.getUpcomingTests = async (req, res) => {
    try {
        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        
        if (!facultyUser || facultyUser.role !== 'faculty') {
            return res.status(403).json({ 
                success: false,
                message: "Unauthorized - Faculty only" 
            });
        }

        const collegeId = facultyUser.college?._id;
        
        if (!collegeId) {
            return res.status(400).json({ 
                success: false,
                message: "Faculty not associated with any college" 
            });
        }

        const now = new Date();
        const upTest = await Test.find({
            collegeId: collegeId,
            facultyId: facultyUser._id,
            "schedule.isScheduled": true,
            "schedule.endTime": { $gte: now }
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: upTest.length,
            data: upTest
        });
    } catch(error) {
        console.error('Upcoming tests error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching upcoming tests", 
            error: error.message 
        });
    }
};

// Get recent tests (filtered by college and faculty)
exports.getRecentTests = async (req, res) => {
    try {
        const facultyUser = await User.findById(req.user._id).populate('college').lean();
        
        if (!facultyUser || facultyUser.role !== 'faculty') {
            return res.status(403).json({ 
                success: false,
                message: "Unauthorized - Faculty only" 
            });
        }

        const collegeId = facultyUser.college?._id;
        
        if (!collegeId) {
            return res.status(400).json({ 
                success: false,
                message: "Faculty not associated with any college" 
            });
        }

        const recentTest = await Test.find({
            collegeId: collegeId,
            facultyId: facultyUser._id
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const recentTestIds = recentTest.map(t => t._id);
        const attemptStats = await TestAttempt.aggregate([
            {
                $match: {
                    testId: { $in: recentTestIds },
                    collegeId: collegeId
                }
            },
            {
                $group: {
                    _id: "$testId",
                    attempts: { $sum: 1 },
                    avgPercentage: { $avg: "$percentage" }
                }
            }
        ]);

        const statsMap = attemptStats.reduce((acc, item) => {
            acc[item._id.toString()] = {
                attempts: item.attempts,
                avgScore: item.avgPercentage || 0
            };
            return acc;
        }, {});

        const recentTestWithStats = recentTest.map(test => {
            const stats = statsMap[test._id.toString()] || { attempts: 0, avgScore: 0 };
            return {
                ...test,
                attempts: stats.attempts,
                avgScore: stats.avgScore
            };
        });
        
        res.status(200).json({
            success: true,
            data: recentTestWithStats
        });
    } catch(error) {
        console.error('Recent tests error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching recent tests", 
            error: error.message 
        });
    }
};