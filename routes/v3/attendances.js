const express = require("express");
const router = express.Router();
const attendances = require("../../controller/v3/attendances");

router.post("/allEmpAttendances", attendances.getAllEmpAttendances);
router.post("/empAttendanceByID", attendances.getEmpAttendanceByID);
router.post("/empAttendancesByEmpID", attendances.getEmpAttendancesByEmpID);
router.post(
  "/empAttendancesByMonthAndYear",
  attendances.getEmpAttendancesByMonthAndYear
);
router.post("/addNewEmpAttendance", attendances.addNewEmpAttendance);
router.post("/updateEmpAttendance", attendances.updateEmpAttendance);
router.post("/deleteEmpAttendance", attendances.deleteEmpAttendance);

module.exports = router;
