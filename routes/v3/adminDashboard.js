const express = require("express");
const router = express.Router();
const adminDashboard = require("../../controller/v3/adminDashboard");

router.post("/adminDashboardData", adminDashboard.getAdminDashboardData);
router.post(
  "/salesOverviewChartData",
  adminDashboard.getSalesOverviewChartData
);
router.post(
  "/revenueOverviewChartData",
  adminDashboard.getRevenueOverviewChartData
);

module.exports = router;
