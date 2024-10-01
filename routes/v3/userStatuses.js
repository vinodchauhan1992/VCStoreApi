const express = require("express");
const router = express.Router();
const userStatuses = require("../../controller/v3/userStatuses");

router.post("/allUserStatuses", userStatuses.getAllUserStatuses);
router.post("/userStatusByID", userStatuses.getUserStatusByID);
router.post("/addUserStatus", userStatuses.addUserStatus);
router.post("/deleteUserStatus", userStatuses.deleteUserStatus);

module.exports = router;
