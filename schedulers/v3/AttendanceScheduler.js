const cron = require("node-cron");
const EmployeesUtility = require("../../utilities/v3/employeesUtility");
const AttendanceUtility = require("../../utilities/v3/attendanceUtility");

module.exports.autoSubmitAttendanceScheduler = async () => {
  const allEmpsObj = await EmployeesUtility.getAllEmployeesUtil({});
  if (allEmpsObj?.status === "error") {
    return allEmpsObj;
  }

  const empsArray = allEmpsObj?.data ?? [];

  return Promise.all(
    empsArray?.map(async (empData) => {
      const empDetails = await AttendanceUtility.addNewEmpAttendanceUtil({
        req: {
          body: {
            employeeID: empData?.id,
            checkedInStatus: "present",
            checkinDate: new Date(),
          },
        },
      });
      return empDetails;
    })
  );
};

cron.schedule("0 8 */1 * *", async () => {
  const newlyAddedAttendance = await this.autoSubmitAttendanceScheduler();
  console.log(
    "CRON job for auto attendance on date",
    newlyAddedAttendance,
    new Date()
  );
});
