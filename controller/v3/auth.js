const AuthUtility = require("../../utilities/v3/authUtility");

module.exports.login = async (req, res) => {
  const loginObj = await AuthUtility.loginUtil({ req });
  res.json(loginObj);
};

module.exports.employeeLogin = async (req, res) => {
  const loginObj = await AuthUtility.employeeLoginUtil({ req });
  res.json(loginObj);
};

module.exports.customerLogin = async (req, res) => {
  const loginObj = await AuthUtility.customerLoginUtil({ req });
  res.json(loginObj);
};

module.exports.employeeLogout = async (req, res) => {
  const loginObj = await AuthUtility.employeeLogoutUtil({ req });
  res.json(loginObj);
};

module.exports.customerLogout = async (req, res) => {
  const loginObj = await AuthUtility.customerLogoutUtil({ req });
  res.json(loginObj);
};
