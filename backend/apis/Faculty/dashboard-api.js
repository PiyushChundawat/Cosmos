const express = require('express');
const router = express.Router();


app.get("/faculty/dashboard/stats", async (req, res) => {
    try {
        const totalTest = await Test.find();

        const scores = await TestAttempt.find({}).select({ score: 1, _id: 0 });
        const totalScore = scores.reduce((acc, obj) => acc + obj.score, 0);
        const averageScore = totalScore / scores.length;

        const upcomingTest = await Test.find({schedule.isScheduled: true}).select({testTitle});

        res.status(200).json(
          success: true,
          countTotal: totalTest.length,
          averageTestScore: averageScore,
          upcomingTestCount: upcomingTest.length
        );
    }
    catch(error) {
        res.status(500).json({message: "", error: error.message});
    }
});

app.get("/faculty/dashboard/upcoming-test" async(req, res) => {
    try {
        const upTest = await Test.find({
            schedule.isScheduled: true
        }).sort({createdAt: -1});
        
        res.status(200).json{
            success: true,
            count: upTest.length,
            data: upTest
        }
    }
    catch(error) {
        res.status(500).json({message: "", error: error.message});
    }
});

router.get("/faculty/dashboard/recentTest", async (req,res) => {
    try {
        const recentTest = await Test.find()
        .sort({createdAt: -1})
        .limit(5);

        res.status(200).json{
            sucess: true,
            data: recentTest
        }
    }
    catch(error){
        res.status(500).json({message: "", error: error.message);
    }
);
