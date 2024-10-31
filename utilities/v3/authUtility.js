const EmployeesSchema = require("../../model/v3/employees");
const CustomersSchema = require("../../model/v3/customers");
const CommonUtility = require("./commonUtility");
const EmployeesValidationsUtility = require("./employeesValidationsUtility");
const ConstantsUtility = require("./constantsUtility");
const EmployeesLoginUtility = require("./employeesLoginUtility");
const AppIdsUtility = require("./appIdsUtility");

module.exports.employeeLogoutUtil = async ({ req }) => {
  const jwttoken = req?.headers?.jwttoken ?? null;
  if (!jwttoken || jwttoken === "") {
    return {
      status: "error",
      message: `Jwt token is required to logout`,
      data: {},
    };
  }
  return await EmployeesLoginUtility.updateEmployeeLoginLogoutEntryUtil({
    jwtToken: jwttoken,
  });
};

module.exports.employeeLoginUtil = async ({ req }) => {
  if (!req?.body?.employeeCode || req.body.employeeCode === "") {
    return {
      status: "error",
      message: "Employee code is required to login.",
      data: {},
    };
  }
  if (!req?.body?.password || req.body.password === "") {
    return {
      status: "error",
      message: "Password is required to login.",
      data: {},
    };
  }
  if (!req?.headers?.app_id || req.body.app_id === "") {
    return {
      status: "error",
      message: "You are not authorised to login. Please pass app_id in header",
      data: {},
    };
  }
  const appID = req.headers.app_id;
  const foundAppIdObj = await AppIdsUtility.getAppIdByAppIdUtil({
    req: { body: { id: appID } },
  });

  if (foundAppIdObj?.status === "error") {
    return {
      status: "error",
      message: `You are not authorised to login to admin panel. Your passed app_id is not found in app_ids table.`,
      data: {},
    };
  }

  if (
    foundAppIdObj?.status === "success" &&
    foundAppIdObj?.data?.title !== ConstantsUtility.utils.APP_TYPE_ADMIN
  ) {
    return {
      status: "error",
      message: `You are not authorised to login to admin panel. Your passed app_id is incorrect.`,
      data: {},
    };
  }

  const employeeCode = req.body.employeeCode;
  const password = req.body.password;

  const foundLoginObj =
    await EmployeesLoginUtility.checkIfEmployeeIsAlreadyLoggedInByEmpCodeUtil({
      req,
    });
  if (foundLoginObj?.status === "error") {
    await this.employeeLogoutUtil({
      req: {
        headers: {
          jwttoken: foundLoginObj?.data?.jwtToken,
        },
      },
    });
  }

  return await EmployeesSchema.findOne({
    employeeCode: employeeCode,
    password: password,
  })
    .then(async (employeeData) => {
      if (employeeData && Object.keys(employeeData).length > 0) {
        const fullDetailsObj =
          await EmployeesValidationsUtility.getSingleEmployeeWithAllDetails({
            employeeData: CommonUtility.sortObject(employeeData),
          });

        if (
          fullDetailsObj?.statusDetails?.id !==
          ConstantsUtility.utils.ACTIVE_EMPLOYEE_STATUS_ID
        ) {
          return {
            status: "error",
            message: `You cannot login with this employee code "${employeeCode}" as your status is "${fullDetailsObj?.statusDetails?.title}". Please contact administrations department.`,
            data: {},
          };
        }

        const jwtToken = CommonUtility.generateJwtToken({
          uniqueID: fullDetailsObj?.id ?? "",
          uniqueCode: fullDetailsObj?.employeeCode ?? "",
        });

        const employeeLoginObj =
          await EmployeesLoginUtility.addNewEmployeeLoginEntryUtil({
            employeeLoginData: fullDetailsObj,
            jwtToken: jwtToken,
            appID: appID,
          });

        if (employeeLoginObj?.status === "error") {
          return employeeLoginObj;
        }

        return {
          status: "success",
          message: "You are successfully logged in.",
          data: {
            employee: fullDetailsObj,
            jwtToken: jwtToken,
          },
        };
      } else {
        return {
          status: "error",
          message: `There is no employee exists with this employee code "${employeeCode}" and password.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred. ${err.message}`,
        data: {},
      };
    });
};

module.exports.customerLoginUtil = async ({ req }) => {
  if (!req?.body?.username || req.body.username === "") {
    return {
      status: "error",
      message: "Username is required to login.",
      data: {},
    };
  }
  if (!req?.body?.password || req.body.password === "") {
    return {
      status: "error",
      message: "Password is required to login.",
      data: {},
    };
  }
  if (!req?.headers?.app_id || req.body.app_id === "") {
    return {
      status: "error",
      message: "You are not authorised to login. Please pass app_id in header",
      data: {},
    };
  }
  const appID = req.headers.app_id;
  const foundAppIdObj = await AppIdsUtility.getAppIdByAppIdUtil({
    req: { body: { id: appID } },
  });

  if (foundAppIdObj?.status === "error") {
    return {
      status: "error",
      message: `You are not authorised to login to client panel. Your passed app_id is not found in app_ids table.`,
      data: {},
    };
  }

  if (
    foundAppIdObj?.status === "success" &&
    foundAppIdObj?.data?.title !== ConstantsUtility.utils.APP_TYPE_CLIENT
  ) {
    return {
      status: "error",
      message: `You are not authorised to login to client panel. Your passed app_id is incorrect.`,
      data: {},
    };
  }

  const username = req.body.username;
  const password = req.body.password;

  return await CustomersSchema.findOne({
    username: username,
    password: password,
  })
    .then(async (customerData) => {
      if (customerData && Object.keys(customerData).length > 0) {
        const jwtToken = CommonUtility.generateJwtToken({
          uniqueID: customerData?.id ?? "",
          uniqueCode: customerData?.username ?? "",
        });
        return {
          status: "success",
          message: "You are successfully logged in.",
          data: {
            customer: customerData,
            jwtToken: jwtToken,
          },
        };
      } else {
        return {
          status: "error",
          message: `There is no customer exists with this username "${username}" and password.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred. ${err.message}`,
        data: {},
      };
    });
};
