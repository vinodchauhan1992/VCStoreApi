const EmployeeSalariesUtility = require("../../utilities/v3/employeeSalariesUtility");

module.exports.getAllEmpSalaries = async (req, res) => {
  const foundEmpSalaryObject = await EmployeeSalariesUtility.getAllEmpSalariesUtil({
    req,
  });
  res.json(foundEmpSalaryObject);
};

module.exports.getEmpSalaryByID = async (req, res) => {
  const foundEmpSalaryObject = await EmployeeSalariesUtility.getEmpSalaryByIDUtil({
    req,
  });
  res.json(foundEmpSalaryObject);
};

module.exports.getEmpSalaryByEmpID = async (req, res) => {
  const foundEmpSalaryObject =
    await EmployeeSalariesUtility.getEmpSalaryByEmpIDUtil({
      req,
    });
  res.json(foundEmpSalaryObject);
};

module.exports.getEmpSalaryByEmpCode = async (req, res) => {
  const foundEmpSalaryObject =
    await EmployeeSalariesUtility.getEmpSalaryByEmpCodeUtil({
      req,
    });
  res.json(foundEmpSalaryObject);
};

module.exports.addNewEmpSalary = async (req, res) => {
  const foundEmpSalaryObject = await EmployeeSalariesUtility.addNewEmpSalaryUtil({
    req,
  });
  res.json(foundEmpSalaryObject);
};

module.exports.updateEmpSalary = async (req, res) => {
  const foundEmpSalaryObject = await EmployeeSalariesUtility.updateEmpSalaryUtil({
    req,
  });
  res.json(foundEmpSalaryObject);
};

module.exports.deleteEmpSalary = async (req, res) => {
  const foundEmpSalaryObject = await EmployeeSalariesUtility.deleteEmpSalaryUtil({
    req,
  });
  res.json(foundEmpSalaryObject);
};
