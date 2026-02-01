// controllers/analytics/studentAnalytics.controller.js
const TestAttempts = require('../../models/Student/testAttempt');
const User = require('../../models/user.model');
const mongoose = require('mongoose');

// Segregate students by performance bands
exports.getPerformanceBands = async (req, res) => {
    try {
        const { testId, subject } = req.query;
        
        // Get TPO's college from authenticated user
        const tpoUser = await User.findById(req.user._id).populate('college');
        if (!tpoUser || !tpoUser.college) {
            return res.status(403).json({ message: "TPO college not found" });
        }
        
        const collegeId = tpoUser.college._id;
        console.log("Fetching data for college:", collegeId);
        
        // Build query filter with collegeId
        const filter = { collegeId: new mongoose.Types.ObjectId(collegeId) };
        if (testId) filter.testId = new mongoose.Types.ObjectId(testId);
        if (subject) filter.subject = subject;

        console.log("Filter:", filter);

        // Aggregate students into performance bands
        const performanceBands = await TestAttempts.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$studentId",
                    avgPercentage: { $avg: "$percentage" },
                    totalAttempts: { $count: {} },
                    totalScore: { $sum: "$score" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "studentInfo"
                }
            },
            { $unwind: "$studentInfo" },
            {
                $project: {
                    studentId: "$_id",
                    studentName: "$studentInfo.name",
                    rollNumber: "$studentInfo.rollNumber",
                    avgPercentage: 1,
                    totalAttempts: 1,
                    totalScore: 1,
                    performanceBand: {
                        $cond: {
                            if: { $lt: ["$avgPercentage", 40] },
                            then: "below_40",
                            else: {
                                $cond: {
                                    if: { $lt: ["$avgPercentage", 70] },
                                    then: "between_40_70",
                                    else: "above_70"
                                }
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$performanceBand",
                    students: {
                        $push: {
                            studentId: "$studentId",
                            studentName: "$studentName",
                            rollNumber: "$rollNumber",
                            avgPercentage: "$avgPercentage",
                            totalAttempts: "$totalAttempts",
                            totalScore: "$totalScore"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Format response
        const response = {
            below_40: [],
            between_40_70: [],
            above_70: []
        };

        performanceBands.forEach(band => {
            if (band._id === "below_40") {
                response.below_40 = band.students;
            } else if (band._id === "between_40_70") {
                response.between_40_70 = band.students;
            } else if (band._id === "above_70") {
                response.above_70 = band.students;
            }
        });

        console.log("Performance bands response:", response);

        res.status(200).json({
            message: "Performance bands retrieved successfully",
            data: response
        });
    } catch (error) {
        console.error("Error in getPerformanceBands:", error);
        res.status(500).json({ message: "Error retrieving performance bands", error: error.message });
    }
};

// Get top 5 performing students
exports.getTopPerformers = async (req, res) => {
    try {
        const { testId, subject } = req.query;
        
        // Get TPO's college from authenticated user
        const tpoUser = await User.findById(req.user._id).populate('college');
        if (!tpoUser || !tpoUser.college) {
            return res.status(403).json({ message: "TPO college not found" });
        }
        
        const collegeId = tpoUser.college._id;
        console.log("Fetching top performers for college:", collegeId);
        
        // Build query filter with collegeId
        const filter = { collegeId: new mongoose.Types.ObjectId(collegeId) };
        if (testId) filter.testId = new mongoose.Types.ObjectId(testId);
        if (subject) filter.subject = subject;

        console.log("Filter for top performers:", filter);

        // Get top 5 students by aggregate score
        const topPerformers = await TestAttempts.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$studentId",
                    totalScore: { $sum: "$score" },
                    totalMarks: { $sum: "$totalMarks" },
                    avgPercentage: { $avg: "$percentage" },
                    attemptCount: { $count: {} }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "studentInfo"
                }
            },
            { $unwind: "$studentInfo" },
            { $sort: { totalScore: -1 } },
            { $limit: 5 },
            {
                $project: {
                    studentId: "$_id",
                    studentName: "$studentInfo.name",
                    rollNumber: "$studentInfo.rollNumber",
                    email: "$studentInfo.email",
                    _id: 0,
                    totalScore: 1,
                    totalMarks: 1,
                    avgPercentage: { $round: ["$avgPercentage", 2] },
                    attemptCount: 1
                }
            }
        ]);

        console.log("Top performers:", topPerformers);

        res.status(200).json({
            message: "Top performers retrieved successfully",
            data: topPerformers
        });
    } catch (error) {
        console.error("Error in getTopPerformers:", error);
        res.status(500).json({ message: "Error retrieving top performers", error: error.message });
    }
};