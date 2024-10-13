const EmployeesLoginSchema = require("../../model/v3/employeesLogin");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");
const EmployeesUtility = require("./employeesUtility");
const AppIdsUtility = require("./appIdsUtility");

module.exports.getSingleEmployeeLoginsWithAllEmployeesUtil = async ({
  employeeLoginData,
}) => {
  const employeeID = employeeLoginData.employeeID;
  const req = { body: { id: employeeID } };
  const foundEmployeeDataByIDObj = await EmployeesUtility.getEmployeeByIDUtil({
    req,
  });
  let finalObj = {
    ...employeeLoginData,
    employeeData: {},
  };
  if (foundEmployeeDataByIDObj?.status === "success") {
    finalObj = {
      ...finalObj,
      employeeData: foundEmployeeDataByIDObj?.data ?? {},
    };
  }
  const foundAppIdByAppIDObj = await AppIdsUtility.getAppIdByAppIdUtil({
    req: { body: { id: employeeLoginData?.appID } },
  });
  if (foundAppIdByAppIDObj?.status === "success") {
    finalObj = {
      ...finalObj,
      appIdDetails: foundAppIdByAppIDObj?.data,
    };
  }
  return finalObj;
};

module.exports.getAllEmployeeLoginsWithAllEmployeesUtil = async ({
  allEmployeeLoginsArray,
}) => {
  return Promise.all(
    allEmployeeLoginsArray?.map(async (employeeLoginData) => {
      const employeeLoginDetails =
        await this.getSingleEmployeeLoginsWithAllEmployeesUtil({
          employeeLoginData,
        });
      return employeeLoginDetails;
    })
  );
};

module.exports.getAllEmployeeLoginsUtil = async ({ req }) => {
  const employeeLoginObject = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: EmployeesLoginSchema,
    schemaName: "Employee Logins",
  });
  if (employeeLoginObject?.status === "error") {
    return employeeLoginObject;
  }

  const fullEmpDetailsArr = await this.getAllEmployeeLoginsWithAllEmployeesUtil(
    { allEmployeeLoginsArray: employeeLoginObject?.data ?? [] }
  );

  return {
    ...employeeLoginObject,
    data: fullEmpDetailsArr,
  };
};

module.exports.getEmployeeLoginsByEmpIDUtil = async ({ req }) => {
  if (!req?.body?.employeeID || req.body.employeeID === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: [],
    };
  }
  const employeeID = req.body.employeeID;
  const employeeLoginObject =
    await CommonApisUtility.getDataArrayByIdFromSchemaUtil({
      schema: EmployeesLoginSchema,
      schemaName: "Employee",
      dataID: employeeID,
      keyname: "employeeID",
    });
  if (employeeLoginObject?.status === "error") {
    return {
      ...employeeLoginObject,
      message: `Employee login details not found with employee id ${employeeID}`,
    };
  }

  const fullEmpDetailsArr = await this.getAllEmployeeLoginsWithAllEmployeesUtil(
    { allEmployeeLoginsArray: employeeLoginObject?.data ?? [] }
  );

  return {
    ...employeeLoginObject,
    message: `Employee login details found with employee id ${employeeID}`,
    data: fullEmpDetailsArr,
  };
};

module.exports.getEmployeeLoginByLoginIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Login id is required.`,
      data: {},
    };
  }
  const employeeLoginObject = await CommonApisUtility.getDataByIdFromSchemaUtil(
    {
      schema: EmployeesLoginSchema,
      schemaName: "Employee Login",
      dataID: req.body.id,
    }
  );
  if (employeeLoginObject?.status === "error") {
    return employeeLoginObject;
  }

  const fullEmpDetailsObj =
    await this.getSingleEmployeeLoginsWithAllEmployeesUtil({
      employeeLoginData: employeeLoginObject?.data,
    });

  return {
    ...employeeLoginObject,
    data: fullEmpDetailsObj,
  };
};

module.exports.getEmployeeLoginsByEmpCodeUtil = async ({ req }) => {
  if (!req?.body?.employeeCode || req.body.employeeCode === "") {
    return {
      status: "error",
      message: `Employee code is required.`,
      data: [],
    };
  }
  const employeeCode = req.body.employeeCode;
  const employeeLoginObject =
    await CommonApisUtility.getDataArrayByCodeFromSchemaUtil({
      schema: EmployeesLoginSchema,
      schemaName: "Employee",
      dataCode: employeeCode,
      keyname: "employeeCode",
    });

  if (employeeLoginObject?.status === "error") {
    return {
      ...employeeLoginObject,
      message: `Employee login details not found with employee code ${employeeCode}`,
    };
  }

  const fullEmpDetailsArr = await this.getAllEmployeeLoginsWithAllEmployeesUtil(
    { allEmployeeLoginsArray: employeeLoginObject?.data ?? [] }
  );

  return {
    ...employeeLoginObject,
    message: `Employee login details found with employee code ${employeeCode}`,
    data: fullEmpDetailsArr,
  };
};

module.exports.getEmployeeLoginByJwtTokenUtil = async ({ req }) => {
  if (!req?.body?.jwtToken || req.body.jwtToken === "") {
    return {
      status: "error",
      message: `Jwt token is required.`,
      data: {},
    };
  }
  const jwtToken = req.body.jwtToken;
  const employeeLoginObject =
    await CommonApisUtility.getDataByJwtTokenFromSchemaUtil({
      schema: EmployeesLoginSchema,
      schemaName: "Employee Login",
      jwtToken: jwtToken,
    });
  if (employeeLoginObject?.status === "error") {
    return employeeLoginObject;
  }

  const fullEmpDetailsObj =
    await this.getSingleEmployeeLoginsWithAllEmployeesUtil({
      employeeLoginData: employeeLoginObject?.data,
    });

  return {
    ...employeeLoginObject,
    data: fullEmpDetailsObj,
  };
};

module.exports.addNewEmployeeLoginEntryUtil = async ({
  employeeLoginData,
  jwtToken,
  appID,
}) => {
  if (!employeeLoginData?.id || employeeLoginData.id === "") {
    return {
      status: "error",
      message: "Invalid login. Employee id is required.",
      data: {},
    };
  }
  if (
    !employeeLoginData?.employeeCode ||
    employeeLoginData.employeeCode === ""
  ) {
    return {
      status: "error",
      message: "Invalid login. Employee code is required.",
      data: {},
    };
  }
  if (!jwtToken || jwtToken === "") {
    return {
      status: "error",
      message: "Invalid login. Jwt token is required.",
      data: {},
    };
  }
  if (!appID || appID === "") {
    return {
      status: "error",
      message: "Invalid login. app id is required.",
      data: {},
    };
  }

  const newEmployeeLogin = new EmployeesLoginSchema({
    id: CommonUtility.getUniqueID(),
    employeeID: employeeLoginData.id,
    appID: appID,
    employeeCode: employeeLoginData.employeeCode,
    jwtToken: jwtToken,
    loginDateTime: new Date(),
    logoutDateTime: null,
    isLogout: false,
  });

  const newlyAddedEmployeeLoginObj =
    await CommonApisUtility.addNewDataToSchemaUtil({
      newSchema: newEmployeeLogin,
      schemaName: "Employee Login",
    });

  if (newlyAddedEmployeeLoginObj?.status === "error") {
    return {
      status: "error",
      message: "Invalid login. Login details not added to table.",
      data: {},
    };
  }
  return newlyAddedEmployeeLoginObj;
};

module.exports.checkIfEmployeeIsAlreadyLoggedInByEmpCodeUtil = async ({
  req,
}) => {
  const foundObjectData = await this.getEmployeeLoginsByEmpCodeUtil({ req });
  let dataArray = [];
  if (foundObjectData?.status === "success") {
    dataArray = foundObjectData?.data ?? [];
  }

  const foundObject = dataArray?.find((dataObj) => !dataObj.isLogout);
  if (foundObject) {
    return {
      status: "error",
      message:
        "You are already logged in somewhere. Please logout first from the device you have last loggedin",
      data: {},
    };
  }
  return {
    status: "success",
    message: "You can login",
    data: {},
  };
};

module.exports.updateEmployeeLoginLogoutEntryUtil = async ({ jwtToken }) => {
  if (!jwtToken || jwtToken === "") {
    return {
      status: "error",
      message: `Jwt token is required to logout`,
      data: {},
    };
  }

  const req = { body: { jwtToken: jwtToken } };

  const foundLoggedinObject = await this.getEmployeeLoginByJwtTokenUtil({
    req,
  });

  if (foundLoggedinObject?.status === "error") {
    return {
      status: "error",
      message: `You are not logged out. Error: ${foundLoggedinObject?.message}`,
      data: {},
    };
  }

  if (
    foundLoggedinObject?.status === "success" &&
    !foundLoggedinObject?.data?.isLogout
  ) {
    const newEmployeeLogin = {
      jwtToken: jwtToken,
      logoutDateTime: new Date(),
      isLogout: true,
    };
    const updatedEmployeeLoginSet = {
      $set: newEmployeeLogin,
    };

    await CommonApisUtility.updateDataByJwtTokenInSchemaUtil({
      schema: EmployeesLoginSchema,
      newDataObject: newEmployeeLogin,
      updatedDataSet: updatedEmployeeLoginSet,
      schemaName: "Employee Login",
      jwtToken: jwtToken,
    });
    return {
      status: "success",
      message: `You are successfully logged out.`,
      data: {},
    };
  }

  return {
    status: "error",
    message: `You are not logged out. Error: ${foundLoggedinObject?.message}`,
    data: {},
  };
};
