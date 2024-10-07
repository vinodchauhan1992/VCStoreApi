const User = require("../../model/v3/user");
const EmployeesSchema = require("../../model/v3/employees");
const CustomersSchema = require("../../model/v3/customers");
const UserUtility = require("./userUtility");
const CommonUtility = require("./commonUtility");
const EmployeesValidationsUtility = require("./employeesValidationsUtility");
const ConstantsUtility = require("./constantsUtility");
const EmployeesLoginUtility = require("./employeesLoginUtility");

module.exports.loginUtil = async ({ req }) => {
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
  if (!req?.headers?.user_panel || req.body.user_panel === "") {
    return {
      status: "error",
      message:
        "You are not authorised to login. Please pass user_panel in header",
      data: {},
    };
  }
  if (req.headers.user_panel !== "User") {
    return {
      status: "error",
      message:
        "You are not authorised to login. Please pass user_panel in header",
      data: {},
    };
  }
  if (req?.headers?.admin_panel) {
    return {
      status: "error",
      message:
        "You are not authorised to login as you are passing admin_panel in header in user login api.",
      data: {},
    };
  }
  if (req?.headers?.customer_panel) {
    return {
      status: "error",
      message:
        "You are not authorised to login as you are passing customer_panel in header in user login api.",
      data: {},
    };
  }

  const username = req.body.username;
  const password = req.body.password;

  return await User.findOne({
    username: username,
    password: password,
  })
    .then(async (user) => {
      if (user && Object.keys(user).length > 0) {
        const fullDetailsUser = await UserUtility.getSingleUserWithAllDetails({
          userData: CommonUtility.sortObject(user),
        });
        if (
          fullDetailsUser?.userStatusDetails?.status &&
          fullDetailsUser.userStatusDetails.status === "Active"
        ) {
          const jwtToken = CommonUtility.generateJwtToken({
            uniqueID: fullDetailsUser?.id ?? "",
            uniqueCode: fullDetailsUser?.username ?? "",
          });
          return {
            status: "success",
            message: "You are successfully logged in.",
            data: {
              user: fullDetailsUser,
              jwtToken: jwtToken,
            },
          };
        } else {
          return {
            status: "error",
            message: `You can't login with this user as this user is ${fullDetailsUser.userStatusDetails.status}`,
            data: {},
          };
        }
      } else {
        return {
          status: "error",
          message: `There is no user exists with this username ${username} and password.`,
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
  if (!req?.headers?.admin_panel || req.body.admin_panel === "") {
    return {
      status: "error",
      message:
        "You are not authorised to login. Please pass admin_panel in header",
      data: {},
    };
  }
  if (req.headers.admin_panel !== "Administrations") {
    return {
      status: "error",
      message:
        "You are not authorised to login. Please pass admin_panel in header",
      data: {},
    };
  }
  if (req?.headers?.customer_panel) {
    return {
      status: "error",
      message:
        "You are not authorised to login to admin panel as you are passing customer_panel in header.",
      data: {},
    };
  }
  if (req?.headers?.user_panel) {
    return {
      status: "error",
      message:
        "You are not authorised to login to admin panel as you are passing user_panel in header.",
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
    return foundLoginObj;
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
          fullDetailsObj?.departmentDetails?.id !==
          ConstantsUtility.utils.ADMIN_DEPARTMENT_ID
        ) {
          return {
            status: "error",
            message: `You cannot login with this employee code "${employeeCode}" as you are "${fullDetailsObj?.departmentDetails?.title}" department and not from Administration department. Please contact administrations department.`,
            data: {},
          };
        }

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
  if (req?.headers?.admin_panel) {
    return {
      status: "error",
      message:
        "You are not authorised to login as you are passing admin_panel to customer login api.",
      data: {},
    };
  }
  if (req?.headers?.user_panel) {
    return {
      status: "error",
      message:
        "You are not authorised to login as you are passing user_panel to customer login api.",
      data: {},
    };
  }
  if (!req?.headers?.customer_panel || req.body.customer_panel === "") {
    return {
      status: "error",
      message:
        "You are not authorised to login. Please pass customer_panel in header",
      data: {},
    };
  }
  if (req.headers.customer_panel !== "Customer") {
    return {
      status: "error",
      message: `You are not authorised to login. Please pass "Customer" in customer_panel in header`,
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
