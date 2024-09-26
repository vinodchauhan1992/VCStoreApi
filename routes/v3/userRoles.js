const express = require("express");
const router = express.Router();
const userRoles = require("../../controller/v3/userRoles");

router.get("/allUserRoles", userRoles.getAllUserRoles);
router.get("/userRoleByID/:userRoleID", userRoles.getUserRoleByID);
router.post("/addUserRole", userRoles.addUserRole);
router.delete("/deleteUserRole/:userRoleID", userRoles.deleteUserRole);
router.put("/updateUserRole/:userRoleID", userRoles.updateUserRole);
router.get("/userRoleByRole/:userRole", userRoles.getUserRoleByRole);

module.exports = router;
