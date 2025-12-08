// backend/routes/faculty.routes.js

const express = require("express");
const router = express.Router();

// yaha baad me tum core faculty auth/profile routes add kar sakti ho
// e.g.
// const facultyController = require("../controllers/facultyController");
// router.post("/register", facultyController.registerFaculty);

router.get("/health", (req, res) => {
  res.json({ ok: true, route: "core faculty" });
});

module.exports = router;
