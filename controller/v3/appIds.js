const AppIdsUtility = require("../../utilities/v3/appIdsUtility");

module.exports.getAllAppIds = async (req, res) => {
  const foundAppIdObj = await AppIdsUtility.getAllAppIdsUtil({ req });
  res.json(foundAppIdObj);
};

module.exports.getAppIdByAppId = async (req, res) => {
  const foundAppIdObj = await AppIdsUtility.getAppIdByAppIdUtil({ req });
  res.json(foundAppIdObj);
};

module.exports.getAppIdByAppTitle = async (req, res) => {
  const foundAppIdObj = await AppIdsUtility.getAppIdByAppTitleUtil({ req });
  res.json(foundAppIdObj);
};

module.exports.addNewAppIdEntry = async (req, res) => {
  const foundAppIdObj = await AppIdsUtility.addNewAppIdEntryUtil({ req });
  res.json(foundAppIdObj);
};

module.exports.updateAppIdEntry = async (req, res) => {
  const foundAppIdObj = await AppIdsUtility.updateAppIdEntryUtil({ req });
  res.json(foundAppIdObj);
};

module.exports.deleteAppIdEntry = async (req, res) => {
  const foundAppIdObj = await AppIdsUtility.deleteAppIdEntryUtil({ req });
  res.json(foundAppIdObj);
};
