const express = require("express");
const router = express.Router();
const userRoles = require("../controller/userRoles");

router.get("/allUserRoles", userRoles.getAllUserRoles);
router.get("/userRoleByID/:userRoleID", userRoles.getUserRoleByID);
router.post("/addUserRole", userRoles.addUserRole);
router.delete("/deleteUserRole/:userRoleID", userRoles.deleteUserRole);

module.exports = router;
