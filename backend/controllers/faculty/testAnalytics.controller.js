// controllers/analytics/testAnalytics.controller.js
const jwt = require('jsonwebtoken');
const TestAttempts = require('../../models/Student/testAttempt');
const Test = require('../../models/Faculty/test');
const User = require('../../models/user.model');

// Helper function to get user from token
const getUserFromToken = async (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No token provided");
    }
    
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('college').lean();
    
    if (!user) {
        throw new Error("User not found");
    }
    
    return user;
};

// Get test summary for a specific test
exports.getTestSummary = async (req, res) => {
    try {
        const { testId } = req.params;
        
        // Get user from token
        const facultyUser = await getUserFromToken(req);
        
        if (!facultyUser || facultyUser.role !== 'faculty') {
            return res.status(403).json({ message: "Unauthorized: Faculty access only" });
        }

        const facultyId = facultyUser._id;
        const collegeId = facultyUser.college?._id;

        // Verify test belongs to faculty AND same college
        const test = await Test.findOne({ 
            _id: testId, 
            facultyId: facultyId,
            collegeId: collegeId 
        });
        
        if (!test) {
            return res.status(404).json({ message: "Test not found or unauthorized" });
        }

        const attempts = await TestAttempts.find({ testId, collegeId });

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
        
        const passedCount = attempts.filter(a => a.percentage >= 40).length;
        const passRate = (passedCount / totalAttempts) * 100;

        res.status(200).json({
            message: "Test summary fetched successfully",
            data: {
                testId,
                subject: test.testTitle || 'N/A',
                totalAttempts,
                averageScore: averageScore.toFixed(2),
                averagePercentage: averagePercentage.toFixed(2),
                highestScore,
                lowestScore,
                passRate: passRate.toFixed(2),
                totalMarks: test.totalMarks
            }
        });
    } catch (error) {
        console.error('getTestSummary error:', error);
        if (error.message === "No token provided" || error.message === "User not found") {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: "Error fetching test summary", error: error.message });
    }
};

// Get question-wise statistics for a test
exports.getQuestionStats = async (req, res) => {
    try {
        const { testId } = req.params;
        
        // Get user from token
        const facultyUser = await getUserFromToken(req);
        
        if (!facultyUser || facultyUser.role !== 'faculty') {
            return res.status(403).json({ message: "Unauthorized: Faculty access only" });
        }

        const facultyId = facultyUser._id;
        const collegeId = facultyUser.college?._id;

        // Verify test belongs to faculty
        const test = await Test.findOne({ 
            _id: testId, 
            facultyId: facultyId,
            collegeId: collegeId 
        }).populate('questionIds');
        
        if (!test) {
            return res.status(404).json({ message: "Test not found or unauthorized" });
        }

        const attempts = await TestAttempts.find({ testId, collegeId });

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

        // Calculate accuracy rates and add question details
        const questionStatsArray = Object.values(questionStats).map(stat => {
            const question = test.questionIds.find(q => q._id.toString() === stat.questionId);
            const accuracyRate = ((stat.correctAttempts / stat.totalAttempts) * 100).toFixed(2);
            
            let difficulty = 'Medium';
            if (parseFloat(accuracyRate) >= 75) difficulty = 'Easy';
            else if (parseFloat(accuracyRate) < 50) difficulty = 'Hard';
            
            return {
                ...stat,
                questionText: question?.questionText || 'Question not found',
                difficulty: difficulty,
                accuracyRate: accuracyRate
            };
        });

        questionStatsArray.sort((a, b) => parseFloat(a.accuracyRate) - parseFloat(b.accuracyRate));

        res.status(200).json({
            message: "Question statistics fetched successfully",
            data: questionStatsArray
        });
    } catch (error) {
        console.error('getQuestionStats error:', error);
        if (error.message === "No token provided" || error.message === "User not found") {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: "Error fetching question statistics", error: error.message });
    }
};

// Get average test scores for all tests by faculty
exports.getAllTestsSummary = async (req, res) => {
    try {
        // Get user from token
        const facultyUser = await getUserFromToken(req);
        
        if (!facultyUser || facultyUser.role !== 'faculty') {
            return res.status(403).json({ message: "Unauthorized: Faculty access only" });
        }

        const facultyId = facultyUser._id;
        const collegeId = facultyUser.college?._id;

        const tests = await Test.find({ facultyId, collegeId });
        
        if (tests.length === 0) {
            return res.status(200).json({
                message: "No tests found",
                data: []
            });
        }

        const summaries = [];

        for (let test of tests) {
            const attempts = await TestAttempts.find({ testId: test._id, collegeId });
            
            if (attempts.length > 0) {
                const avgScore = attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;
                const avgPercentage = attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length;
                
                summaries.push({
                    testId: test._id,
                    testName: test.testTitle || test.subject || 'Untitled Test',
                    subject: test.testTitle || 'N/A',
                    totalAttempts: attempts.length,
                    averageScore: avgScore.toFixed(2),
                    averagePercentage: avgPercentage.toFixed(2),
                    totalMarks: test.totalMarks
                });
            }
        }

        res.status(200).json({
            message: "All tests summary fetched successfully",
            data: summaries
        });
    } catch (error) {
        console.error('getAllTestsSummary error:', error);
        if (error.message === "No token provided" || error.message === "User not found") {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: "Error fetching all tests summary", error: error.message });
    }
};

// Get top 5 and worst 5 performing students for a test
exports.getStudentPerformance = async (req, res) => {
    try {
        const { testId } = req.params;
        
        // Get user from token
        const facultyUser = await getUserFromToken(req);
        
        if (!facultyUser || facultyUser.role !== 'faculty') {
            return res.status(403).json({ message: "Unauthorized: Faculty access only" });
        }

        const facultyId = facultyUser._id;
        const collegeId = facultyUser.college?._id;

        const test = await Test.findOne({ 
            _id: testId, 
            facultyId: facultyId,
            collegeId: collegeId 
        });
        
        if (!test) {
            return res.status(404).json({ message: "Test not found or unauthorized" });
        }

        const attempts = await TestAttempts.find({ testId, collegeId })
            .populate('studentId', 'name email rollNumber')
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
            studentName: a.studentId.name || 'Unknown',
            rollNumber: a.studentId.rollNumber || 'N/A',
            score: a.score,
            percentage: a.percentage.toFixed(2),
            totalMarks: a.totalMarks
        }));

        const worstPerformers = attempts.slice(-5).reverse().map(a => ({
            studentId: a.studentId._id,
            studentName: a.studentId.name || 'Unknown',
            rollNumber: a.studentId.rollNumber || 'N/A',
            score: a.score,
            percentage: a.percentage.toFixed(2),
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
        console.error('getStudentPerformance error:', error);
        if (error.message === "No token provided" || error.message === "User not found") {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: "Error fetching student performance", error: error.message });
    }
};