const express = require("express");
const router = express.Router();
const employeeRoles = require("../../controller/v3/employeeRoles");

router.post("/allEmployeeRoles", employeeRoles.getAllEmployeeRoles);
router.post("/employeeRoleByID", employeeRoles.getEmployeeRoleByID);
router.post("/addNewEmployeeRole", employeeRoles.addNewEmployeeRole);
router.post("/updateEmployeeRole", employeeRoles.updateEmployeeRole);
router.post("/deleteEmployeeRole", employeeRoles.deleteEmployeeRole);

module.exports = router;
