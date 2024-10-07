const StatusesUtility = require("../../utilities/v3/statusesUtility");

module.exports.getAllStatuses = async (req, res) => {
  const foundStatusObject =
    await StatusesUtility.getAllStatusesUtil({
      req,
    });
  res.json(foundStatusObject);
};

module.exports.getStatusByID = async (req, res) => {
  const foundStatusObject =
    await StatusesUtility.getStatusByIDUtil({
      req,
    });
  res.json(foundStatusObject);
};

module.exports.addNewStatus = async (req, res) => {
  const foundStatusObject =
    await StatusesUtility.addNewStatusUtil({
      req,
    });
  res.json(foundStatusObject);
};

module.exports.updateStatus = async (req, res) => {
  const foundStatusObject =
    await StatusesUtility.updateStatusUtil({
      req,
    });
  res.json(foundStatusObject);
};

module.exports.deleteStatus = async (req, res) => {
  const foundStatusObject =
    await StatusesUtility.deleteStatusUtil({
      req,
    });
  res.json(foundStatusObject);
};
