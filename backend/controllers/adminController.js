const Student = require("../models/student.model");
const Test = require("../models/test.modal");
const TestAttempt = require("../models/testAttempt.model");


exports.getSubjectAnalytics = async (req, res) => {
  try {
    const stats = await TestAttempt.aggregate([
      {
        $lookup: {
          from: "tests",        
          localField: "test",    
          foreignField: "_id",
          as: "testInfo",
        },
      },
      { $unwind: "$testInfo" },
      {
        $group: {
          _id: "$testInfo.subject",   
          avgScore: { $avg: "$score" },
          attempts: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          subject: "$_id",
          avgScore: 1,
          attempts: 1,
        },
      },
      { $sort: { subject: 1 } },
    ]);

    res.json({ success: true, data: stats });
  } catch (err) {
    console.error("getSubjectAnalytics error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.getBatchPerformance = async (req, res) => {
  try {
    const stats = await TestAttempt.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "stu",
        },
      },
      { $unwind: "$stu" },
      {
        $group: {
          _id: "$stu.batchYear",      
          avgScore: { $avg: "$score" },
          attempts: { $sum: 1 },
          students: { $addToSet: "$stu._id" },
        },
      },
      {
        $project: {
          _id: 0,
          batchYear: "$_id",
          avgScore: 1,
          attempts: 1,
          studentCount: { $size: "$students" },
        },
      },
      { $sort: { batchYear: 1 } },
    ]);

    res.json({ success: true, data: stats });
  } catch (err) {
    console.error("getBatchPerformance error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getPlacementReadinessIndex = async (req, res) => {
  try {
    const overall = await TestAttempt.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$score" } } },
    ]);

    const overallAvgScore = overall[0]?.avgScore || 0;

    const [totalStudents, totalAttempts] = await Promise.all([
      Student.countDocuments(),
      TestAttempt.countDocuments(),
    ]);

    const attemptsPerStudent =
      totalStudents > 0 ? totalAttempts / totalStudents : 0;

    const normalizedAttemptsScore = Math.min(attemptsPerStudent * 10, 100);

    const readinessIndex =
      0.7 * overallAvgScore + 0.3 * normalizedAttemptsScore;

    res.json({
      success: true,
      data: {
        overallAvgScore,
        totalStudents,
        totalAttempts,
        attemptsPerStudent,
        normalizedAttemptsScore,
        readinessIndex,
      },
    });
  } catch (err) {
    console.error("getPlacementReadinessIndex error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

exports.getTrendAnalysis = async (req, res) => {
  try {
    const trend = await TestAttempt.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          avgScore: { $avg: "$score" },
          attempts: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          avgScore: 1,
          attempts: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    res.json({ success: true, data: trend });
  } catch (err) {
    console.error("getTrendAnalysis error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.exportReports = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({})
      .populate("student", "email rollNo batchYear")
      .populate("test", "subject");

    let csv = "Email,RollNo,BatchYear,Subject,Score,Date\n";

    attempts.forEach((a) => {
      csv += `${a.student?.email || ""},${a.student?.rollNo || ""},${
        a.student?.batchYear || ""
      },${a.test?.subject || ""},${a.score},${
        a.createdAt?.toISOString() || ""
      }\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=placement-dashboard-report.csv"
    );

    res.status(200).send(csv);
  } catch (err) {
    console.error("exportReports error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}