const express = require("express");
const router = express.Router();
const appIds = require("../../controller/v3/appIds");

router.post("/allAppIds", appIds.getAllAppIds);
router.post("/appIdByAppId", appIds.getAppIdByAppId);
router.post("/appIdByAppTitle", appIds.getAppIdByAppTitle);
router.post("/addNewAppIdEntry", appIds.addNewAppIdEntry);
router.post("/updateAppIdEntry", appIds.updateAppIdEntry);
router.post("/deleteAppIdEntry", appIds.deleteAppIdEntry);

module.exports = router;
