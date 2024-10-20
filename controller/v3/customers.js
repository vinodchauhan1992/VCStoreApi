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

module.exports.getCustomerByCustomerCode = async (req, res) => {
  const foundCustomerObject =
    await CustomersUtility.getCustomerByCustomerCodeUtil({
      req,
    });
  res.json(foundCustomerObject);
};

module.exports.getCustomerByUsername = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.getCustomerByUsernameUtil({
    req,
  });
  res.json(foundCustomerObject);
};

module.exports.getCustomerByEmail = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.getCustomerByEmailUtil({
    req,
  });
  res.json(foundCustomerObject);
};

module.exports.getCustomerByPhone = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.getCustomerByPhoneUtil({
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

module.exports.registerNewCustomer = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.registerNewCustomerUtil({
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

module.exports.updateCustomerPhoto = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.updateCustomerPhotoUtil({
    req,
  });
  res.json(foundCustomerObject);
};

module.exports.updateCustomerName = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.updateCustomerNameUtil({
    req,
  });
  res.json(foundCustomerObject);
};

module.exports.updateCustomerAddress = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.updateCustomerAddressUtil({
    req,
  });
  res.json(foundCustomerObject);
};

module.exports.updateCustomerPhone = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.updateCustomerPhoneUtil({
    req,
  });
  res.json(foundCustomerObject);
};

module.exports.updateCustomerStatus = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.updateCustomerStatusUtil({
    req,
  });
  res.json(foundCustomerObject);
};

module.exports.updateCustomerGender = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.updateCustomerGenderUtil({
    req,
  });
  res.json(foundCustomerObject);
};

module.exports.updateCustomerDob = async (req, res) => {
  const foundCustomerObject = await CustomersUtility.updateCustomerDobUtil({
    req,
  });
  res.json(foundCustomerObject);
};
