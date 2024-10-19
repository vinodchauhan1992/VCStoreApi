const AttendancesSchema = require("../../model/v3/attendances");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");
const EmployeesUtility = require("./employeesUtility");

module.exports.getSingleAttendanceWithAllEmployeeDataUtil = async ({
  attendanceData,
}) => {
  const employeeID = attendanceData.employeeID;
  const req = { body: { id: employeeID } };
  const foundEmployeeDataByIDObj = await EmployeesUtility.getEmployeeByIDUtil({
    req,
  });
  let finalObj = {
    ...attendanceData,
    employeeData: {},
  };
  if (foundEmployeeDataByIDObj?.status === "success") {
    finalObj = {
      ...finalObj,
      employeeData: foundEmployeeDataByIDObj?.data ?? {},
    };
  }
  return finalObj;
};

module.exports.getAllAttendancesWithAllEmployeesUtil = async ({
  allAttendancesArray,
}) => {
  return Promise.all(
    allAttendancesArray?.map(async (attendanceData) => {
      const attendanceDetails =
        await this.getSingleAttendanceWithAllEmployeeDataUtil({
          attendanceData: attendanceData,
        });
      return attendanceDetails;
    })
  );
};

module.exports.getAllEmpAttendancesUtil = async ({ req }) => {
  const foundAttendanceObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: AttendancesSchema,
    schemaName: "Attendances",
  });

  if (foundAttendanceObj?.status === "error") {
    return foundAttendanceObj;
  }

  const dataArr = foundAttendanceObj?.data ?? [];

  const fullEmpDetailsArr = await this.getAllAttendancesWithAllEmployeesUtil({
    allAttendancesArray: dataArr,
  });

  return {
    ...foundAttendanceObj,
    data: fullEmpDetailsArr,
  };
};

module.exports.getEmpAttendanceByIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Attendance id is required.`,
      data: {},
    };
  }
  const attendanceObject = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: AttendancesSchema,
    schemaName: "Attendance",
    dataID: req.body.id,
  });
  if (attendanceObject?.status === "error") {
    return attendanceObject;
  }

  const fullEmpDetailsObj =
    await this.getSingleAttendanceWithAllEmployeeDataUtil({
      attendanceData: attendanceObject?.data,
    });

  return {
    ...attendanceObject,
    data: fullEmpDetailsObj,
  };
};

module.exports.getEmpAttendancesByEmpIDUtil = async ({ req }) => {
  if (!req?.body?.employeeID || req.body.employeeID === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }
  const employeeID = req.body.employeeID;
  const attendancesObject =
    await CommonApisUtility.getDataArrayByIdFromSchemaUtil({
      schema: AttendancesSchema,
      schemaName: "Attendances",
      dataID: employeeID,
      keyname: "employeeID",
    });
  if (attendancesObject?.status === "error") {
    return {
      ...attendancesObject,
      message: `Attendances details not found with employee id ${employeeID}`,
    };
  }

  const fullEmpDetailsObj = await this.getAllAttendancesWithAllEmployeesUtil({
    allAttendancesArray: attendancesObject?.data ?? [],
  });

  return {
    ...attendancesObject,
    message: `Attendances details found with employee id ${employeeID}`,
    data: fullEmpDetailsObj,
  };
};

module.exports.isAttendaceExistsForEmployeeUtil = async ({
  attendancesDataArr,
  currentDateInNumber,
  currentMonthInNumber,
  currentYear,
  currentCheckinDate,
  employeeID,
}) => {
  let isExists = false;
  attendancesDataArr?.map((attData) => {
    const checkinDateData = attData?.checkinDateData;
    if (
      Number(checkinDateData?.dateInNumber) === Number(currentDateInNumber) &&
      Number(checkinDateData?.monthInNumber) === Number(currentMonthInNumber) &&
      Number(checkinDateData?.year) === Number(currentYear)
    ) {
      isExists = true;
    }
  });

  if (isExists) {
    return {
      status: "error",
      message: `Attendance for employee id ${employeeID} for date ${currentCheckinDate} already exists.`,
      data: {},
    };
  }
  return {
    status: "success",
    message: `Attendance for employee id ${employeeID} for date ${currentCheckinDate} not exists.`,
    data: {},
  };
};

module.exports.addNewEmpAttendanceUtil = async ({ req }) => {
  if (!req?.body?.employeeID || req.body.employeeID === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }
  if (!req?.body?.checkedInStatus || req.body.checkedInStatus === "") {
    return {
      status: "error",
      message: `Checkedin status is required.`,
      data: {},
    };
  }
  if (
    req.body.checkedInStatus.toLowerCase() !== "present" &&
    req.body.checkedInStatus.toLowerCase() !== "absent" &&
    req.body.checkedInStatus.toLowerCase() !== "half day"
  ) {
    return {
      status: "error",
      message: `Checkedin status can be only Present, Absent or Half Day.`,
      data: {},
    };
  }
  if (!req?.body?.checkinDate || req.body.checkinDate === "") {
    return {
      status: "error",
      message: `Checkin date time is required.`,
      data: {},
    };
  }

  const attendanceID = CommonUtility.getUniqueID();
  const employeeID = req.body.employeeID;
  const checkedInStatus = CommonUtility.capitalizeLetterOfEachWord({
    str: req.body.checkedInStatus,
  });
  const checkinDate = new Date(req.body.checkinDate);
  const day = checkinDate.toLocaleDateString("en-us", { weekday: "long" });
  const dateInNumber = checkinDate.getDate();
  const monthInNumber = checkinDate.toLocaleDateString("en-us", {
    month: "numeric",
  });
  const year = checkinDate.getFullYear();
  const fullMonth = checkinDate.toLocaleDateString("en-us", { month: "long" });
  const dateAdded = new Date();
  const dateModified = new Date();

  const foundEmpObj = await EmployeesUtility.getEmployeeByIDUtil({
    req: { body: { id: employeeID } },
  });

  if (foundEmpObj?.status === "error") {
    return foundEmpObj;
  }

  if (
    foundEmpObj?.status === "success" &&
    foundEmpObj?.data?.statusDetails?.title?.toLowerCase() !== "active"
  ) {
    return {
      status: "error",
      message: `You cannot add attendance for this employee. This employee is ${foundEmpObj?.data?.statusDetails?.title}`,
      data: {},
    };
  }

  const foundAttendancesByEmpIdObj = await this.getEmpAttendancesByEmpIDUtil({
    req: { body: { employeeID: employeeID } },
  });

  if (foundAttendancesByEmpIdObj?.status === "success") {
    const foundExistenceObj = await this.isAttendaceExistsForEmployeeUtil({
      attendancesDataArr: foundAttendancesByEmpIdObj?.data ?? [],
      currentDateInNumber: dateInNumber,
      currentMonthInNumber: monthInNumber,
      currentYear: year,
      currentCheckinDate: checkinDate,
      employeeID: employeeID,
    });
    if (foundExistenceObj?.status === "error") {
      return foundExistenceObj;
    }
  }

  const newAttendanceObj = {
    id: attendanceID,
    employeeID: employeeID,
    checkedInStatus: checkedInStatus,
    checkinDateData: {
      checkinDate: checkinDate,
      day: day,
      dateInNumber: dateInNumber,
      monthInNumber: monthInNumber,
      year: year,
      fullMonth: fullMonth,
    },
    dateAdded: dateAdded,
    dateModified: dateModified,
  };
  const newAttendanceSchema = new AttendancesSchema(newAttendanceObj);

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newAttendanceSchema,
    schemaName: "Attendance",
  });
};

module.exports.updateEmpAttendanceUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Attendance id is required.`,
      data: {},
    };
  }
  if (!req?.body?.checkedInStatus || req.body.checkedInStatus === "") {
    return {
      status: "error",
      message: `Checkedin status is required.`,
      data: {},
    };
  }
  if (
    req.body.checkedInStatus.toLowerCase() !== "present" &&
    req.body.checkedInStatus.toLowerCase() !== "absent" &&
    req.body.checkedInStatus.toLowerCase() !== "half day"
  ) {
    return {
      status: "error",
      message: `Checkedin status can be only Present, Absent or Half Day.`,
      data: {},
    };
  }

  const attendanceID = req.body.id;
  const checkedInStatus = CommonUtility.capitalizeLetterOfEachWord({
    str: req.body.checkedInStatus,
  });
  const dateModified = new Date();

  const foundAttendanceObj = CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: AttendancesSchema,
    schemaName: "Attendance",
    dataID: attendanceID,
  });

  if (foundAttendanceObj?.status === "error") {
    return foundAttendanceObj;
  }

  const updatedAttendanceObj = {
    id: attendanceID,
    checkedInStatus: checkedInStatus,
    dateModified: dateModified,
  };

  const updatedAttendanceSet = {
    $set: updatedAttendanceObj,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: AttendancesSchema,
    newDataObject: updatedAttendanceObj,
    updatedDataSet: updatedAttendanceSet,
    schemaName: "Attendance",
    dataID: attendanceID,
  });
};

module.exports.deleteEmpAttendanceUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Attendance id is required.",
      data: {},
    };
  }

  const attendanceID = req.body.id;

  const foundAttendanceObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: AttendancesSchema,
    schemaName: "Attendance",
    dataID: attendanceID,
  });

  if (foundAttendanceObj?.status === "error") {
    return foundAttendanceObj;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: AttendancesSchema,
    schemaName: "Attendance",
    dataID: attendanceID,
  });
};

module.exports.getEmpAttendancesByMonthAndYearUtil = async ({ req }) => {
  if (!req?.body?.monthInNumber || req.body.monthInNumber === "") {
    return {
      status: "error",
      message: `Month is required.`,
      data: {},
    };
  }
  if (!req?.body?.year || req.body.year === "") {
    return {
      status: "error",
      message: `Year is required.`,
      data: {},
    };
  }
  const monthInNumber = req.body.monthInNumber;
  const year = req.body.year;
  const attendancesObject =
    await CommonApisUtility.getDataArrayByMonthAndYearFromSchemaUtil({
      schema: AttendancesSchema,
      schemaName: "Attendance",
      monthInNumber: Number(monthInNumber),
      monthKeyname: "checkinDateData.monthInNumber",
      year: Number(year),
      yearKeyname: "checkinDateData.year",
    });
  if (attendancesObject?.status === "error") {
    return attendancesObject;
  }

  const fullEmpDetailsObj = await this.getAllAttendancesWithAllEmployeesUtil({
    allAttendancesArray: attendancesObject?.data ?? [],
  });

  return {
    ...attendancesObject,
    message: `Attendances details found with month ${monthInNumber} and year ${year}`,
    data: fullEmpDetailsObj,
  };
};
