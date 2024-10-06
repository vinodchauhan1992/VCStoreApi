const express = require("express");
const router = express.Router();
const departments = require("../../controller/v3/departments");

router.post("/allDepartments", departments.getAllDepartments);
router.post("/departmentByID", departments.getDepartmentByID);
router.post("/departmentByCode", departments.getDepartmentByCode);
router.post("/addNewDepartment", departments.addNewDepartment);
router.post("/updateDepartment", departments.updateDepartment);
router.post("/deleteDepartment", departments.deleteDepartment);

module.exports = router;
