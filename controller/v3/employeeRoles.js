const EmployeeRolesUtility = require("../../utilities/v3/employeeRolesUtility");

module.exports.getAllEmployeeRoles = async (req, res) => {
  const foundEmployeeRoleObject =
    await EmployeeRolesUtility.getAllEmployeeRolesUtil({
      req,
    });
  res.json(foundEmployeeRoleObject);
};

module.exports.getEmployeeRoleByID = async (req, res) => {
  const foundEmployeeRoleObject =
    await EmployeeRolesUtility.getEmployeeRoleByIDUtil({
      req,
    });
  res.json(foundEmployeeRoleObject);
};

module.exports.getEmployeeRoleByDepartmentID = async (req, res) => {
  const foundEmployeeRoleObject =
    await EmployeeRolesUtility.getEmployeeRoleByDepartmentIDUtil({
      req,
    });
  res.json(foundEmployeeRoleObject);
};

module.exports.addNewEmployeeRole = async (req, res) => {
  const foundEmployeeRoleObject =
    await EmployeeRolesUtility.addNewEmployeeRoleUtil({
      req,
    });
  res.json(foundEmployeeRoleObject);
};

module.exports.updateEmployeeRole = async (req, res) => {
  const foundEmployeeRoleObject =
    await EmployeeRolesUtility.updateEmployeeRoleUtil({
      req,
    });
  res.json(foundEmployeeRoleObject);
};

module.exports.deleteEmployeeRole = async (req, res) => {
  const foundEmployeeRoleObject =
    await EmployeeRolesUtility.deleteEmployeeRoleUtil({
      req,
    });
  res.json(foundEmployeeRoleObject);
};
