const EmployeesUtility = require("../../utilities/v3/employeesUtility");

module.exports.getAllEmployees = async (req, res) => {
  const foundEmployeeObject = await EmployeesUtility.getAllEmployeesUtil({
    req,
  });
  res.json(foundEmployeeObject);
};

module.exports.getEmployeeByID = async (req, res) => {
  const foundEmployeeObject = await EmployeesUtility.getEmployeeByIDUtil({
    req,
  });
  res.json(foundEmployeeObject);
};

module.exports.addNewEmployee = async (req, res) => {
  const foundEmployeeObject = await EmployeesUtility.addNewEmployeeUtil({
    req,
  });
  res.json(foundEmployeeObject);
};

module.exports.deleteEmployee = async (req, res) => {
  const foundEmployeeObject = await EmployeesUtility.deleteEmployeeUtil({
    req,
  });
  res.json(foundEmployeeObject);
};
