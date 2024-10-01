const express = require("express");
const router = express.Router();
const userRoles = require("../../controller/v3/userRoles");

router.post("/allUserRoles", userRoles.getAllUserRoles);
router.post("/userRoleByID", userRoles.getUserRoleByID);
router.post("/addUserRole", userRoles.addUserRole);
router.post("/deleteUserRole", userRoles.deleteUserRole);
router.post("/updateUserRole", userRoles.updateUserRole);
router.post("/userRoleByRole", userRoles.getUserRoleByRole);

module.exports = router;
