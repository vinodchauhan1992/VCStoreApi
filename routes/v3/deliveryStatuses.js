const express = require("express");
const router = express.Router();
const deliveryStatuses = require("../../controller/v3/deliveryStatuses");

router.post("/allDeliveryStatuses", deliveryStatuses.getAllDeliveryStatuses);
router.post("/deliveryStatusByID", deliveryStatuses.getDeliveryStatusByID);
router.post("/deliveryStatusByCode", deliveryStatuses.getDeliveryStatusByCode);
router.post("/addNewDeliveryStatus", deliveryStatuses.addNewDeliveryStatus);
router.post("/updateDeliveryStatus", deliveryStatuses.updateDeliveryStatus);
router.post("/deleteDeliveryStatus", deliveryStatuses.deleteDeliveryStatus);

module.exports = router;
