// controllers/analytics/facultyAnalytics.controller.js
const TestAttempt = require("../../models/Student/testAttempt");
const User = require("../../models/user.model");
const mongoose = require('mongoose');

// Get performance bands by faculty/subject
exports.getPerformanceBands = async (req, res) => {
    try {
        const { subject } = req.query;
        
        if (!subject) {
            return res.status(400).json({ message: "Subject/Faculty identifier is required" });
        }

        // Get TPO's college from authenticated user
        const tpoUser = await User.findById(req.user._id).populate('college');
        if (!tpoUser || !tpoUser.college) {
            return res.status(403).json({ message: "TPO college not found" });
        }
        
        const collegeId = new mongoose.Types.ObjectId(tpoUser.college._id);
        console.log("Fetching faculty analytics for college:", collegeId, "subject:", subject);

        // Aggregate students into performance bands for specific subject and college
        const performanceBands = await TestAttempt.aggregate([
            { $match: { subject: subject, collegeId: collegeId } },
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
            subject: subject,
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

        console.log("Faculty performance bands response:", response);

        res.status(200).json({
            message: "Faculty performance bands retrieved successfully",
            data: response
        });
    } catch (error) {
        console.error("Error in getPerformanceBands:", error);
        res.status(500).json({ message: "Error retrieving faculty performance bands", error: error.message });
    }
};

// Get complete faculty analytics with average scores
exports.getCompleteAnalytics = async (req, res) => {
    try {
        const { subject } = req.query;
        
        if (!subject) {
            return res.status(400).json({ message: "Subject/Faculty identifier is required" });
        }

        // Get TPO's college from authenticated user
        const tpoUser = await User.findById(req.user._id).populate('college');
        if (!tpoUser || !tpoUser.college) {
            return res.status(403).json({ message: "TPO college not found" });
        }
        
        const collegeId = new mongoose.Types.ObjectId(tpoUser.college._id);
        console.log("Fetching complete analytics for college:", collegeId, "subject:", subject);

        // Get comprehensive faculty analytics
        const analytics = await TestAttempt.aggregate([
            { $match: { subject: subject, collegeId: collegeId } },
            {
                $facet: {
                    // Overall subject statistics
                    overallStats: [
                        {
                            $group: {
                                _id: null,
                                avgScore: { $avg: "$score" },
                                avgPercentage: { $avg: "$percentage" },
                                totalAttempts: { $count: {} },
                                totalStudents: { $addToSet: "$studentId" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                avgScore: { $round: ["$avgScore", 2] },
                                avgPercentage: { $round: ["$avgPercentage", 2] },
                                totalAttempts: 1,
                                totalStudents: { $size: "$totalStudents" }
                            }
                        }
                    ],
                    // Top 5 performers
                    topPerformers: [
                        {
                            $group: {
                                _id: "$studentId",
                                totalScore: { $sum: "$score" },
                                avgPercentage: { $avg: "$percentage" }
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
                        { $unwind: { path: "$studentInfo", preserveNullAndEmptyArrays: true } },
                        { $sort: { totalScore: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                studentId: "$_id",
                                studentName: "$studentInfo.name",
                                rollNumber: "$studentInfo.rollNumber",
                                _id: 0,
                                totalScore: 1,
                                avgPercentage: { $round: ["$avgPercentage", 2] }
                            }
                        }
                    ],
                    // Performance bands
                    performanceBands: [
                        {
                            $group: {
                                _id: "$studentId",
                                avgPercentage: { $avg: "$percentage" }
                            }
                        },
                        {
                            $project: {
                                studentId: "$_id",
                                avgPercentage: 1,
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
                                        avgPercentage: "$avgPercentage"
                                    }
                                },
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]);

        // Format performance bands
        const performanceBands = {
            below_40: [],
            between_40_70: [],
            above_70: []
        };

        analytics[0].performanceBands.forEach(band => {
            if (band._id === "below_40") {
                performanceBands.below_40 = band.students;
            } else if (band._id === "between_40_70") {
                performanceBands.between_40_70 = band.students;
            } else if (band._id === "above_70") {
                performanceBands.above_70 = band.students;
            }
        });

        res.status(200).json({
            message: "Complete faculty analytics retrieved successfully",
            data: {
                subject: subject,
                overallStats: analytics[0].overallStats[0] || {},
                topPerformers: analytics[0].topPerformers,
                performanceBands: performanceBands
            }
        });
    } catch (error) {
        console.error("Error in getCompleteAnalytics:", error);
        res.status(500).json({ message: "Error retrieving faculty analytics", error: error.message });
    }
};