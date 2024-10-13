const express = require("express");
const router = express.Router();
const employeeSalaries = require("../../controller/v3/employeeSalaries");

router.post("/allEmpSalaries", employeeSalaries.getAllEmpSalaries);
router.post("/empSalaryByID", employeeSalaries.getEmpSalaryByID);
router.post("/empSalaryByEmpID", employeeSalaries.getEmpSalaryByEmpID);
router.post("/empSalaryByEmpCode", employeeSalaries.getEmpSalaryByEmpCode);
router.post("/addNewEmpSalary", employeeSalaries.addNewEmpSalary);
router.post("/updateEmpSalary", employeeSalaries.updateEmpSalary);
router.post("/deleteEmpSalary", employeeSalaries.deleteEmpSalary);

module.exports = router;
