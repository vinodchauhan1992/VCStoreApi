const EmployeesSchema = require("../../model/v3/employees");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");

module.exports.getAllEmployeesUtil = async ({ req }) => {
  return {
    status: "success",
    message: `getAllEmployees - ${req}`,
    data: [],
  };
};

module.exports.getEmployeeByIDUtil = async ({ req }) => {
  return {
    status: "success",
    message: `getEmployeeByID - ${req}`,
    data: [],
  };
};

module.exports.addNewEmployeeUtil = async ({ req }) => {
  return {
    status: "success",
    message: `addNewEmployee - ${req}`,
    data: [],
  };
};

module.exports.deleteEmployeeUtil = async ({ req }) => {
  return {
    status: "success",
    message: `deleteEmployee - ${req}`,
    data: [],
  };
};
