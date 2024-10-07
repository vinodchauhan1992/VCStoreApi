const express = require("express");
const router = express.Router();
const statuses = require("../../controller/v3/statuses");

router.post("/allStatuses", statuses.getAllStatuses);
router.post("/statusByID", statuses.getStatusByID);
router.post("/addNewStatus", statuses.addNewStatus);
router.post("/updateStatus", statuses.updateStatus);
router.post("/deleteStatus", statuses.deleteStatus);

module.exports = router;
