const AttendanceUtility = require("../../utilities/v3/attendanceUtility");

module.exports.getAllEmpAttendances = async (req, res) => {
  const foundEmpAttendanceObject =
    await AttendanceUtility.getAllEmpAttendancesUtil({
      req,
    });
  res.json(foundEmpAttendanceObject);
};

module.exports.getEmpAttendanceByID = async (req, res) => {
  const foundEmpAttendanceObject =
    await AttendanceUtility.getEmpAttendanceByIDUtil({
      req,
    });
  res.json(foundEmpAttendanceObject);
};

module.exports.getEmpAttendancesByEmpID = async (req, res) => {
  const foundEmpAttendanceObject =
    await AttendanceUtility.getEmpAttendancesByEmpIDUtil({
      req,
    });
  res.json(foundEmpAttendanceObject);
};

module.exports.getEmpAttendancesByMonthAndYear = async (req, res) => {
  const foundEmpAttendanceObject =
    await AttendanceUtility.getEmpAttendancesByMonthAndYearUtil({
      req,
    });
  res.json(foundEmpAttendanceObject);
};

module.exports.addNewEmpAttendance = async (req, res) => {
  const foundEmpAttendanceObject =
    await AttendanceUtility.addNewEmpAttendanceUtil({
      req,
    });
  res.json(foundEmpAttendanceObject);
};

module.exports.updateEmpAttendance = async (req, res) => {
  const foundEmpAttendanceObject =
    await AttendanceUtility.updateEmpAttendanceUtil({
      req,
    });
  res.json(foundEmpAttendanceObject);
};

module.exports.deleteEmpAttendance = async (req, res) => {
  const foundEmpAttendanceObject =
    await AttendanceUtility.deleteEmpAttendanceUtil({
      req,
    });
  res.json(foundEmpAttendanceObject);
};
