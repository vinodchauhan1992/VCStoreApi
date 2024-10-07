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

module.exports.updateEmployeePhoto = async (req, res) => {
  const foundEmployeeObject = await EmployeesUtility.updateEmployeePhotoUtil({
    req,
  });
  res.json(foundEmployeeObject);
};

module.exports.updateEmployeeName = async (req, res) => {
  const foundEmployeeObject = await EmployeesUtility.updateEmployeeNameUtil({
    req,
  });
  res.json(foundEmployeeObject);
};

module.exports.updateEmployeePreferredName = async (req, res) => {
  const foundEmployeeObject =
    await EmployeesUtility.updateEmployeePreferredNameUtil({
      req,
    });
  res.json(foundEmployeeObject);
};

module.exports.updateEmployeeAddress = async (req, res) => {
  const foundEmployeeObject = await EmployeesUtility.updateEmployeeAddressUtil({
    req,
  });
  res.json(foundEmployeeObject);
};

module.exports.updateEmployeePhone = async (req, res) => {
  const foundEmployeeObject = await EmployeesUtility.updateEmployeePhoneUtil({
    req,
  });
  res.json(foundEmployeeObject);
};

module.exports.updateEmployeeDepartment = async (req, res) => {
  const foundEmployeeObject =
    await EmployeesUtility.updateEmployeeDepartmentUtil({
      req,
    });
  res.json(foundEmployeeObject);
};

module.exports.updateEmployeeGender = async (req, res) => {
  const foundEmployeeObject = await EmployeesUtility.updateEmployeeGenderUtil({
    req,
  });
  res.json(foundEmployeeObject);
};

module.exports.updateEmployeeStatus = async (req, res) => {
  const foundEmployeeObject = await EmployeesUtility.updateEmployeeStatusUtil({
    req,
  });
  res.json(foundEmployeeObject);
};

module.exports.updateEmployeeDob = async (req, res) => {
  const foundEmployeeObject = await EmployeesUtility.updateEmployeeDobUtil({
    req,
  });
  res.json(foundEmployeeObject);
};

module.exports.updateEmployeeDoj = async (req, res) => {
  const foundEmployeeObject = await EmployeesUtility.updateEmployeeDojUtil({
    req,
  });
  res.json(foundEmployeeObject);
};

module.exports.employeeLayOff = async (req, res) => {
  const foundEmployeeObject = await EmployeesUtility.employeeLayOffUtil({
    req,
  });
  res.json(foundEmployeeObject);
};
