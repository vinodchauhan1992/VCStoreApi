const express = require("express");
const router = express.Router();
const employeesLogin = require("../../controller/v3/employeesLogin");

router.post("/allEmployeeLogins", employeesLogin.getAllEmployeeLogins);
router.post("/employeeLoginsByEmpID", employeesLogin.getEmployeeLoginsByEmpID);
router.post(
  "/employeeLoginByLoginID",
  employeesLogin.getEmployeeLoginByLoginID
);
router.post(
  "/employeeLoginsByEmpCode",
  employeesLogin.getEmployeeLoginsByEmpCode
);
router.post(
  "/employeeLoginByJwtToken",
  employeesLogin.getEmployeeLoginByJwtToken
);

module.exports = router;
