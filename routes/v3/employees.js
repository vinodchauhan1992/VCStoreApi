const express = require("express");
const router = express.Router();
const employees = require("../../controller/v3/employees");

router.post("/allEmployees", employees.getAllEmployees);
router.post("/employeeByID", employees.getEmployeeByID);
router.post("/addNewEmployee", employees.addNewEmployee);
router.post("/deleteEmployee", employees.deleteEmployee);

module.exports = router;
