const AuthUtility = require("../../utilities/v3/authUtility");

module.exports.login = async (req, res) => {
  const foundObj = await AuthUtility.loginUtil({ req });
  res.json(foundObj);
};

module.exports.employeeLogin = async (req, res) => {
  const foundObj = await AuthUtility.employeeLoginUtil({ req });
  res.json(foundObj);
};

module.exports.customerLogin = async (req, res) => {
  const foundObj = await AuthUtility.customerLoginUtil({ req });
  res.json(foundObj);
};

module.exports.employeeLogout = async (req, res) => {
  const foundObj = await AuthUtility.employeeLogoutUtil({ req });
  res.json(foundObj);
};

module.exports.customerLogout = async (req, res) => {
  const foundObj = await AuthUtility.customerLogoutUtil({ req });
  res.json(foundObj);
};

module.exports.changePassword = async (req, res) => {
  const foundObj = await AuthUtility.changePasswordUtil({ req });
  res.json(foundObj);
};
