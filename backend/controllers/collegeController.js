const College = require("../models/College.model");

exports.getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find();

    res.json({
      count: colleges.length,
      colleges,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch colleges" });
  }
};