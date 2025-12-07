// controllers/analytics/testAnalytics.controller.js
const TestAttempts = require('../../models/TestAttempts');
const Test = require('../../models/Test');

// Get test summary for a specific test
exports.getTestSummary = async (req, res) => {
    try {
        const { testId } = req.params;
        const facultyId = req.user.id; // Assuming faculty ID comes from auth middleware

        // Verify test belongs to faculty
        const test = await Test.findOne({ _id: testId, facultyId });
        if (!test) {
            return res.status(404).json({ message: "Test not found or unauthorized" });
        }

        const attempts = await TestAttempts.find({ testId });

        if (attempts.length === 0) {
            return res.status(200).json({
                message: "No attempts found for this test",
                data: {
                    totalAttempts: 0,
                    averageScore: 0,
                    averagePercentage: 0,
                    highestScore: 0,
                    lowestScore: 0,
                    passRate: 0
                }
            });
        }

        const totalAttempts = attempts.length;
        const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
        const averageScore = totalScore / totalAttempts;
        
        const totalPercentage = attempts.reduce((sum, attempt) => sum + attempt.percentage, 0);
        const averagePercentage = totalPercentage / totalAttempts;
        
        const scores = attempts.map(a => a.score);
        const highestScore = Math.max(...scores);
        const lowestScore = Math.min(...scores);
        
        const passedCount = attempts.filter(a => a.percentage >= 40).length; // Assuming 40% is passing
        const passRate = (passedCount / totalAttempts) * 100;

        res.status(200).json({
            message: "Test summary fetched successfully",
            data: {
                testId,
                subject: attempts[0].subject,
                totalAttempts,
                averageScore: averageScore.toFixed(2),
                averagePercentage: averagePercentage.toFixed(2),
                highestScore,
                lowestScore,
                passRate: passRate.toFixed(2),
                totalMarks: attempts[0].totalMarks
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching test summary", error: error.message });
    }
};

// Get question-wise statistics for a test
exports.getQuestionStats = async (req, res) => {
    try {
        const { testId } = req.params;
        const facultyId = req.user.id;

        // Verify test belongs to faculty
        const test = await Test.findOne({ _id: testId, facultyId });
        if (!test) {
            return res.status(404).json({ message: "Test not found or unauthorized" });
        }

        const attempts = await TestAttempts.find({ testId });

        if (attempts.length === 0) {
            return res.status(200).json({
                message: "No attempts found for this test",
                data: []
            });
        }

        // Aggregate question statistics
        const questionStats = {};

        attempts.forEach(attempt => {
            attempt.answers.forEach(answer => {
                const qId = answer.questionId.toString();
                
                if (!questionStats[qId]) {
                    questionStats[qId] = {
                        questionId: qId,
                        totalAttempts: 0,
                        correctAttempts: 0,
                        incorrectAttempts: 0,
                        accuracyRate: 0
                    };
                }

                questionStats[qId].totalAttempts++;
                if (answer.isCorrect) {
                    questionStats[qId].correctAttempts++;
                } else {
                    questionStats[qId].incorrectAttempts++;
                }
            });
        });

        // Calculate accuracy rates
        const questionStatsArray = Object.values(questionStats).map(stat => ({
            ...stat,
            accuracyRate: ((stat.correctAttempts / stat.totalAttempts) * 100).toFixed(2)
        }));

        // Sort by accuracy rate (lowest first to identify difficult questions)
        questionStatsArray.sort((a, b) => parseFloat(a.accuracyRate) - parseFloat(b.accuracyRate));

        res.status(200).json({
            message: "Question statistics fetched successfully",
            data: questionStatsArray
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching question statistics", error: error.message });
    }
};

// Get average test scores for all tests by faculty
exports.getAllTestsSummary = async (req, res) => {
    try {
        const facultyId = req.user.id;

        // Get all tests by faculty
        const tests = await Test.find({ facultyId });
        
        if (tests.length === 0) {
            return res.status(200).json({
                message: "No tests found",
                data: []
            });
        }

        const testIds = tests.map(t => t._id);
        const summaries = [];

        for (let test of tests) {
            const attempts = await TestAttempts.find({ testId: test._id });
            
            if (attempts.length > 0) {
                const avgScore = attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;
                const avgPercentage = attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length;
                
                summaries.push({
                    testId: test._id,
                    testName: test.name || test.subject,
                    subject: test.subject,
                    totalAttempts: attempts.length,
                    averageScore: avgScore.toFixed(2),
                    averagePercentage: avgPercentage.toFixed(2),
                    totalMarks: attempts[0].totalMarks
                });
            }
        }

        res.status(200).json({
            message: "All tests summary fetched successfully",
            data: summaries
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching all tests summary", error: error.message });
    }
};

// Get top 5 and worst 5 performing students for a test
exports.getStudentPerformance = async (req, res) => {
    try {
        const { testId } = req.params;
        const facultyId = req.user.id;

        // Verify test belongs to faculty
        const test = await Test.findOne({ _id: testId, facultyId });
        if (!test) {
            return res.status(404).json({ message: "Test not found or unauthorized" });
        }

        const attempts = await TestAttempts.find({ testId })
            .populate('studentId', 'name email rollNumber') // Assuming student model has these fields
            .sort({ score: -1 });

        if (attempts.length === 0) {
            return res.status(200).json({
                message: "No attempts found",
                data: {
                    topPerformers: [],
                    worstPerformers: []
                }
            });
        }

        const topPerformers = attempts.slice(0, 5).map(a => ({
            studentId: a.studentId._id,
            studentName: a.studentId.name,
            rollNumber: a.studentId.rollNumber,
            score: a.score,
            percentage: a.percentage,
            totalMarks: a.totalMarks
        }));

        const worstPerformers = attempts.slice(-5).reverse().map(a => ({
            studentId: a.studentId._id,
            studentName: a.studentId.name,
            rollNumber: a.studentId.rollNumber,
            score: a.score,
            percentage: a.percentage,
            totalMarks: a.totalMarks
        }));

        res.status(200).json({
            message: "Student performance fetched successfully",
            data: {
                topPerformers,
                worstPerformers
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching student performance", error: error.message });
    }
};