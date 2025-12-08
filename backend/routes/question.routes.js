// backend/routes/question.routes.js

const express = require("express");
const router = express.Router();

// yaha baad me tum core question routes add kar sakti ho
// const questionController = require("../controllers/question.controller");
// router.get("/", questionController.getAllQuestions);

router.get("/health", (req, res) => {
  res.json({ ok: true, route: "core questions" });
});

module.exports = router;
