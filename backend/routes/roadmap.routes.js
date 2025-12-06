const express = require("express");
const router = express.Router();
const roadmapController = require("../controllers/roadmap.controller");

// later: auth middleware add karna

// POST /api/roadmap/generate
router.post("/generate", roadmapController.generateRoadmap);

// GET /api/roadmap/latest/:studentId
router.get("/latest/:studentId", roadmapController.getLatestRoadmap);

module.exports = router;
