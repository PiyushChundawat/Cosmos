// controllers/analytics/facultyAnalytics.controller.js
const TestAttempt = require("../../models/Student/testAttempt");
const User = require("../../models/user.model");
const mongoose = require('mongoose');

// Get performance bands by faculty/subject
exports.getPerformanceBands = async (req, res) => {
    try {
        const { subject } = req.query;
        if (!subject) return res.status(400).json({ message: "Subject/Faculty identifier is required" });

        const tpoUser = await User.findById(req.user._id).populate('college');
        if (!tpoUser || !tpoUser.college) return res.status(403).json({ message: "TPO college not found" });

        const collegeId = new mongoose.Types.ObjectId(tpoUser.college._id);

        const performanceBands = await TestAttempt.aggregate([
            { $match: { subject: subject, collegeId: collegeId } },
            { $group: { _id: "$studentId", avgPercentage: { $avg: "$percentage" }, totalAttempts: { $count: {} } } },
            {
                $project: {
                    studentId: "$_id", avgPercentage: 1, totalAttempts: 1,
                    performanceBand: {
                        $cond: {
                            if: { $lt: ["$avgPercentage", 40] }, then: "below_40",
                            else: { $cond: { if: { $lt: ["$avgPercentage", 70] }, then: "between_40_70", else: "above_70" } }
                        }
                    }
                }
            },
            { $group: { _id: "$performanceBand", students: { $push: { studentId: "$studentId", avgPercentage: "$avgPercentage", totalAttempts: "$totalAttempts" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const response = { subject, below_40: [], between_40_70: [], above_70: [] };
        performanceBands.forEach(band => { response[band._id] = band.students; });

        res.status(200).json({ message: "Faculty performance bands retrieved successfully", data: response });
    } catch (error) {
        console.error("Error in getPerformanceBands:", error);
        res.status(500).json({ message: "Error retrieving faculty performance bands", error: error.message });
    }
};

// Get complete faculty analytics with average scores
exports.getCompleteAnalytics = async (req, res) => {
    try {
        const { subject } = req.query;
        if (!subject) return res.status(400).json({ message: "Subject/Faculty identifier is required" });

        const tpoUser = await User.findById(req.user._id).populate('college');
        if (!tpoUser || !tpoUser.college) return res.status(403).json({ message: "TPO college not found" });

        const collegeId = new mongoose.Types.ObjectId(tpoUser.college._id);

        const analytics = await TestAttempt.aggregate([
            { $match: { subject: subject, collegeId: collegeId } },
            {
                $facet: {
                    overallStats: [
                        { $group: { _id: null, avgScore: { $avg: "$score" }, avgPercentage: { $avg: "$percentage" }, totalAttempts: { $count: {} }, totalStudents: { $addToSet: "$studentId" } } },
                        { $project: { _id: 0, avgScore: { $round: ["$avgScore", 2] }, avgPercentage: { $round: ["$avgPercentage", 2] }, totalAttempts: 1, totalStudents: { $size: "$totalStudents" } } }
                    ],
                    topPerformers: [
                        { $group: { _id: "$studentId", totalScore: { $sum: "$score" }, avgPercentage: { $avg: "$percentage" } } },
                        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "studentInfo" } },
                        { $unwind: { path: "$studentInfo", preserveNullAndEmptyArrays: true } },
                        { $sort: { totalScore: -1 } },
                        { $limit: 5 },
                        { $project: { studentId: "$_id", studentName: "$studentInfo.name", rollNumber: "$studentInfo.rollNumber", _id: 0, totalScore: 1, avgPercentage: { $round: ["$avgPercentage", 2] } } }
                    ],
                    performanceBands: [
                        { $group: { _id: "$studentId", avgPercentage: { $avg: "$percentage" } } },
                        { $project: { studentId: "$_id", avgPercentage: 1, performanceBand: { $cond: { if: { $lt: ["$avgPercentage", 40] }, then: "below_40", else: { $cond: { if: { $lt: ["$avgPercentage", 70] }, then: "between_40_70", else: "above_70" } } } } } },
                        { $group: { _id: "$performanceBand", students: { $push: { studentId: "$studentId", avgPercentage: "$avgPercentage" } }, count: { $sum: 1 } } }
                    ]
                }
            }
        ]);

        const performanceBands = { below_40: [], between_40_70: [], above_70: [] };
        analytics[0].performanceBands.forEach(band => { performanceBands[band._id] = band.students; });

        res.status(200).json({
            message: "Complete faculty analytics retrieved successfully",
            data: { subject, overallStats: analytics[0].overallStats[0] || {}, topPerformers: analytics[0].topPerformers, performanceBands }
        });
    } catch (error) {
        console.error("Error in getCompleteAnalytics:", error);
        res.status(500).json({ message: "Error retrieving faculty analytics", error: error.message });
    }
};

// Get tests by faculty with student data
exports.getTestsByFaculty = async (req, res) => {
    try {
        const tpoUser = await User.findById(req.user._id).populate('college');
        if (!tpoUser || !tpoUser.college) return res.status(403).json({ message: "TPO college not found" });

        const collegeId = new mongoose.Types.ObjectId(tpoUser.college._id);
        const Test = require("../../models/Faculty/test");

        const testsByFaculty = await Test.aggregate([
            { $match: { collegeId: collegeId } },
            {
                $lookup: {
                    from: "users",
                    localField: "facultyId",
                    foreignField: "_id",
                    as: "facultyInfo"
                }
            },
            { $unwind: { path: "$facultyInfo", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "testattempts",
                    localField: "_id",
                    foreignField: "testId",
                    as: "attempts"
                }
            },
            {
                $addFields: {
                    // FIX: use $map + $reduce to get unique student count safely
                    studentCount: {
                        $size: {
                            $reduce: {
                                input: "$attempts.studentId",
                                initialValue: [],
                                in: {
                                    $cond: [
                                        { $in: ["$$this", "$$value"] },
                                        "$$value",
                                        { $concatArrays: ["$$value", ["$$this"]] }
                                    ]
                                }
                            }
                        }
                    },
                    avgScore: {
                        $cond: [
                            { $gt: [{ $size: "$attempts" }, 0] },
                            { $avg: "$attempts.score" },
                            null
                        ]
                    },
                    avgPercentage: {
                        $cond: [
                            { $gt: [{ $size: "$attempts" }, 0] },
                            { $avg: "$attempts.percentage" },
                            null
                        ]
                    },
                    totalAttempts: { $size: "$attempts" }
                }
            },
            {
                $project: {
                    _id: 1,
                    testTitle: 1,
                    facultyId: 1,
                    facultyName: "$facultyInfo.name",
                    facultyEmail: "$facultyInfo.email",
                    schedule: 1,
                    duration: 1,
                    totalMarks: 1,
                    status: 1,
                    studentCount: 1,
                    avgScore: { $round: ["$avgScore", 2] },
                    avgPercentage: { $round: ["$avgPercentage", 2] },
                    totalAttempts: 1,
                    createdAt: 1,
                    attempts: {
                        $map: {
                            input: "$attempts",
                            as: "attempt",
                            in: {
                                studentId: "$$attempt.studentId",
                                score: "$$attempt.score",
                                percentage: "$$attempt.percentage",
                                status: "$$attempt.status"
                            }
                        }
                    }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        // Populate student names for attempts
        const testsWithStudentNames = await Promise.all(
            testsByFaculty.map(async (test) => {
                if (!test.attempts || test.attempts.length === 0) {
                    return { ...test, attempts: [] };
                }

                const studentIds = [...new Set(test.attempts.map(a => a.studentId?.toString()).filter(Boolean))];
                const studentInfo = await User.find(
                    { _id: { $in: studentIds } },
                    { _id: 1, name: 1, rollNumber: 1, email: 1 }
                );

                const studentMap = {};
                studentInfo.forEach(s => { studentMap[s._id.toString()] = s; });

                const attemptsWithNames = test.attempts.map(a => ({
                    ...a,
                    studentName: studentMap[a.studentId?.toString()]?.name || "Unknown",
                    studentRoll: studentMap[a.studentId?.toString()]?.rollNumber || "N/A",
                    studentEmail: studentMap[a.studentId?.toString()]?.email || "N/A"
                }));

                return { ...test, attempts: attemptsWithNames };
            })
        );

        res.status(200).json({
            message: "Tests by faculty retrieved successfully",
            data: testsWithStudentNames
        });
    } catch (error) {
        console.error("Error in getTestsByFaculty:", error);
        res.status(500).json({ message: "Error retrieving tests by faculty", error: error.message });
    }
};