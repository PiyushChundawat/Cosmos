const express = require('express');
const router = express.Router();
const TestAttempts = require('../models/TestAttempts'); // Adjust path as needed
const mongoose = require('mongoose');

// Student Analytics - Segregate students by performance bands
router.get("/student-analytics/performance-bands", async (req, res) => {
    try {
        const { testId, subject } = req.query;
        
        // Build query filter
        const filter = {};
        if (testId) filter.testId = mongoose.Types.ObjectId(testId);
        if (subject) filter.subject = subject;

        // Aggregate students into performance bands
        const performanceBands = await TestAttempts.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$studentId",
                    avgPercentage: { $avg: "$percentage" },
                    totalAttempts: { $count: {} }
                }
            },
            {
                $project: {
                    studentId: "$_id",
                    avgPercentage: 1,
                    totalAttempts: 1,
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
                            avgPercentage: "$avgPercentage",
                            totalAttempts: "$totalAttempts"
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

        res.status(200).json({
            message: "Performance bands retrieved successfully",
            data: response
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving performance bands", error: error.message });
    }
});

// Student Analytics - Top 5 performing students
router.get("/student-analytics/top-performers", async (req, res) => {
    try {
        const { testId, subject } = req.query;
        
        // Build query filter
        const filter = {};
        if (testId) filter.testId = mongoose.Types.ObjectId(testId);
        if (subject) filter.subject = subject;

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
            { $sort: { totalScore: -1 } },
            { $limit: 5 },
            {
                $project: {
                    studentId: "$_id",
                    _id: 0,
                    totalScore: 1,
                    totalMarks: 1,
                    avgPercentage: { $round: ["$avgPercentage", 2] },
                    attemptCount: 1
                }
            }
        ]);

        res.status(200).json({
            message: "Top performers retrieved successfully",
            data: topPerformers
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving top performers", error: error.message });
    }
});


module.exports = router;