const express = require("express");
const router = express.Router();
const userStatuses = require("../../controller/v3/userStatuses");

router.get("/allUserStatuses", userStatuses.getAllUserStatuses);
router.get("/userStatusByID/:userStatusID", userStatuses.getUserStatusByID);
router.post("/addUserStatus", userStatuses.addUserStatus);
router.delete("/deleteUserStatus/:userStatusID", userStatuses.deleteUserStatus);

module.exports = router;
