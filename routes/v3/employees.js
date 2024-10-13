const express = require("express");
const router = express.Router();
const employees = require("../../controller/v3/employees");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post("/allEmployees", employees.getAllEmployees);
router.post("/employeeByID", employees.getEmployeeByID);
router.post("/employeeByEmployeeCode", employees.getEmployeeByEmployeeCode);
router.post("/addNewEmployee", upload, employees.addNewEmployee);
router.post("/deleteEmployee", employees.deleteEmployee);
router.post("/updateEmployeePhoto", upload, employees.updateEmployeePhoto);
router.post("/updateEmployeeName", employees.updateEmployeeName);
router.post(
  "/updateEmployeePreferredName",
  employees.updateEmployeePreferredName
);
router.post("/updateEmployeeAddress", employees.updateEmployeeAddress);
router.post("/updateEmployeePhone", employees.updateEmployeePhone);
router.post("/updateEmployeeDepartment", employees.updateEmployeeDepartment);
router.post("/updateEmployeeGender", employees.updateEmployeeGender);
router.post("/updateEmployeeStatus", employees.updateEmployeeStatus);
router.post("/updateEmployeeDob", employees.updateEmployeeDob);
router.post("/updateEmployeeDoj", employees.updateEmployeeDoj);
router.post("/employeeLayOff", employees.employeeLayOff);

module.exports = router;
