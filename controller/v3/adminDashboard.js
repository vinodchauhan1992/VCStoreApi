const AdminDashboardUtility = require("../../utilities/v3/adminDashboardUtility");

module.exports.getAdminDashboardData = async (req, res) => {
  const foundItemObj = await AdminDashboardUtility.getAdminDashboardDataUtil();
  res.json(foundItemObj);
};

module.exports.getSalesOverviewChartData = async (req, res) => {
  const foundItemObj =
    await AdminDashboardUtility.getSalesOverviewChartDataUtil({ req });
  res.json(foundItemObj);
};

module.exports.getRevenueOverviewChartData = async (req, res) => {
  const foundItemObj =
    await AdminDashboardUtility.getRevenueOverviewChartDataUtil({ req });
  res.json(foundItemObj);
};
