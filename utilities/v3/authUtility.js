const User = require("../../model/v3/user");
const EmployeesSchema = require("../../model/v3/employees");
const CustomersSchema = require("../../model/v3/customers");
const jwt = require("jsonwebtoken");
const UserUtility = require("./userUtility");
const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");

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
          return {
            status: "success",
            message: "You are successfully logged in.",
            data: {
              user: fullDetailsUser,
              jwtToken: jwt.sign({ user: username }, "secret_key"),
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

  const employeeCode = req.body.employeeCode;
  const password = req.body.password;

  return await EmployeesSchema.findOne({
    employeeCode: employeeCode,
    password: password,
  })
    .then(async (employeeData) => {
      if (employeeData && Object.keys(employeeData).length > 0) {
        return {
          status: "success",
          message: "You are successfully logged in.",
          data: {
            employee: employeeData,
            jwtToken: jwt.sign({ user: employeeCode }, "secret_key"),
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

  const username = req.body.username;
  const password = req.body.password;

  return await CustomersSchema.findOne({
    username: username,
    password: password,
  })
    .then(async (customerData) => {
      if (customerData && Object.keys(customerData).length > 0) {
        return {
          status: "success",
          message: "You are successfully logged in.",
          data: {
            customer: customerData,
            jwtToken: jwt.sign({ user: username }, "secret_key"),
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
