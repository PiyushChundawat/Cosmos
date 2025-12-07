const express = require("express");
const router = express.Router();

const { superAdminLogin, seedSuperAdmin } = require("../controllers/auth/superAdminController");
const { getAllColleges } = require("../controllers/collegeController");
const { protect, requireRole } = require("../middleware/authMiddleware");

router.post("/seed", seedSuperAdmin);
router.post("/login", superAdminLogin);

router.get(
  "/colleges",
  protect,
  requireRole("superadmin"),
  getAllColleges
);

module.exports = router;
