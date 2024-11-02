const DeliveryStatusesUtility = require("../../utilities/v3/deliveryStatusesUtility");

module.exports.getAllDeliveryStatuses = async (req, res) => {
  const foundDeliveryStatusObject =
    await DeliveryStatusesUtility.getAllDeliveryStatusesUtil({
      req,
    });
  res.json(foundDeliveryStatusObject);
};

module.exports.getDeliveryStatusByID = async (req, res) => {
  const foundDeliveryStatusObject =
    await DeliveryStatusesUtility.getDeliveryStatusByIDUtil({
      req,
    });
  res.json(foundDeliveryStatusObject);
};

module.exports.getDeliveryStatusByCode = async (req, res) => {
  const foundDeliveryStatusObject =
    await DeliveryStatusesUtility.getDeliveryStatusByCodeUtil({
      req,
    });
  res.json(foundDeliveryStatusObject);
};

module.exports.addNewDeliveryStatus = async (req, res) => {
  const foundDeliveryStatusObject =
    await DeliveryStatusesUtility.addNewDeliveryStatusUtil({
      req,
    });
  res.json(foundDeliveryStatusObject);
};

module.exports.updateDeliveryStatus = async (req, res) => {
  const foundDeliveryStatusObject =
    await DeliveryStatusesUtility.updateDeliveryStatusUtil({
      req,
    });
  res.json(foundDeliveryStatusObject);
};

module.exports.deleteDeliveryStatus = async (req, res) => {
  const foundDeliveryStatusObject =
    await DeliveryStatusesUtility.deleteDeliveryStatusUtil({
      req,
    });
  res.json(foundDeliveryStatusObject);
};
