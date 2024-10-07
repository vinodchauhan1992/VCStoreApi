const EmployeesLoginUtility = require("../../utilities/v3/employeesLoginUtility");

module.exports.getAllEmployeeLogins = async (req, res) => {
  const foundEmployeeLoginObj =
    await EmployeesLoginUtility.getAllEmployeeLoginsUtil({
      req,
    });
  res.json(foundEmployeeLoginObj);
};

module.exports.getEmployeeLoginsByEmpID = async (req, res) => {
  const foundEmployeeLoginObj =
    await EmployeesLoginUtility.getEmployeeLoginsByEmpIDUtil({
      req,
    });
  res.json(foundEmployeeLoginObj);
};

module.exports.getEmployeeLoginByLoginID = async (req, res) => {
  const foundEmployeeLoginObj =
    await EmployeesLoginUtility.getEmployeeLoginByLoginIDUtil({
      req,
    });
  res.json(foundEmployeeLoginObj);
};

module.exports.getEmployeeLoginsByEmpCode = async (req, res) => {
  const foundEmployeeLoginObj =
    await EmployeesLoginUtility.getEmployeeLoginsByEmpCodeUtil({
      req,
    });
  res.json(foundEmployeeLoginObj);
};

module.exports.getEmployeeLoginByJwtToken = async (req, res) => {
  const foundEmployeeLoginObj =
    await EmployeesLoginUtility.getEmployeeLoginByJwtTokenUtil({
      req,
    });
  res.json(foundEmployeeLoginObj);
};
