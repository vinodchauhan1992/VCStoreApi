const CustomersUtility = require("../../utilities/v3/customersUtility");

module.exports.getAllCustomers = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.getAllCustomersUtil({
    req,
  });
  res.json(foundCustomerObject);
};

module.exports.getCustomerByID = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.getCustomerByIDUtil({
    req,
  });
  res.json(foundCustomerObject);
};

module.exports.addNewCustomer = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.addNewCustomerUtil({
    req,
  });
  res.json(foundCustomerObject);
};

module.exports.deleteCustomer = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.deleteCustomerUtil({
    req,
  });
  res.json(foundCustomerObject);
};
