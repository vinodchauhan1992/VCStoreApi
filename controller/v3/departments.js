const DepartmentsUtility = require("../../utilities/v3/departmentsUtility");

module.exports.getAllDepartments = async (req, res) => {
  const foundDepartmentObject = await DepartmentsUtility.getAllDepartmentsUtil({
    req,
  });
  res.json(foundDepartmentObject);
};

module.exports.getDepartmentByID = async (req, res) => {
  const foundDepartmentObject = await DepartmentsUtility.getDepartmentByIDUtil({
    req,
  });
  res.json(foundDepartmentObject);
};

module.exports.getDepartmentByCode = async (req, res) => {
  const foundDepartmentObject =
    await DepartmentsUtility.getDepartmentByCodeUtil({
      req,
    });
  res.json(foundDepartmentObject);
};

module.exports.addNewDepartment = async (req, res) => {
  const foundDepartmentObject = await DepartmentsUtility.addNewDepartmentUtil({
    req,
  });
  res.json(foundDepartmentObject);
};

module.exports.updateDepartment = async (req, res) => {
  const foundDepartmentObject = await DepartmentsUtility.updateDepartmentUtil({
    req,
  });
  res.json(foundDepartmentObject);
};

module.exports.deleteDepartment = async (req, res) => {
  const foundDepartmentObject = await DepartmentsUtility.deleteDepartmentUtil({
    req,
  });
  res.json(foundDepartmentObject);
};
