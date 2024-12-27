const CustomersLoginUtility = require("../../utilities/v3/customersLoginUtility");

module.exports.getAllCustomerLogins = async (req, res) => {
  const foundCustomerLoginObj =
    await CustomersLoginUtility.getAllCustomerLoginsUtil({
      req,
    });
  res.json(foundCustomerLoginObj);
};

module.exports.getCustomerLoginsByCustID = async (req, res) => {
  const foundCustomerLoginObj =
    await CustomersLoginUtility.getCustomerLoginsByCustIDUtil({
      req,
    });
  res.json(foundCustomerLoginObj);
};

module.exports.getCustomerLoginByLoginID = async (req, res) => {
  const foundCustomerLoginObj =
    await CustomersLoginUtility.getCustomerLoginByLoginIDUtil({
      req,
    });
  res.json(foundCustomerLoginObj);
};

module.exports.getCustomerLoginsByCustUsername = async (req, res) => {
  const foundCustomerLoginObj =
    await CustomersLoginUtility.getCustomerLoginsByCustUsernameUtil({
      req,
    });
  res.json(foundCustomerLoginObj);
};

module.exports.getCustomerLoginByJwtToken = async (req, res) => {
  const foundCustomerLoginObj =
    await CustomersLoginUtility.getCustomerLoginByJwtTokenUtil({
      req,
    });
  res.json(foundCustomerLoginObj);
};
