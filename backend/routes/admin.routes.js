const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");

// Admin dashboard
router.get(
  "/dashboard",
  protect,
  requireRole("admin"),
  (req, res) => {
    res.json({
      message: "Admin dashboard",
      admin: req.user.name,
    });
  }
);

module.exports = router;
