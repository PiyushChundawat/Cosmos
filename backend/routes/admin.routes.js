const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const authmiddleware = require("../middleware/authmiddleware");;
const adminOnly = [authmiddleware];


router.get(
  "/dashboard/subjects",
  adminOnly,
  adminController.getSubjectAnalytics
);

router.get(
  "/dashboard/batches",
  adminOnly,
  adminController.getBatchPerformance
);

router.get(
  "/dashboard/readiness",
  adminOnly,
  adminController.getPlacementReadinessIndex
);

router.get(
  "/dashboard/trends",
  adminOnly,
  adminController.getTrendAnalysis
);

router.get(
  "/dashboard/reports/export",
  adminOnly,
  adminController.exportReports
);

module.exports = router;
