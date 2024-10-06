const CustomersSchema = require("../../model/v3/customers");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");

module.exports.getAllCustomersUtil = async ({ req }) => {
  return {
    status: "success",
    message: `getAllCustomers - ${req}`,
    data: [],
  };
};

module.exports.getCustomerByIDUtil = async ({ req }) => {
  return {
    status: "success",
    message: `getCustomerByID - ${req}`,
    data: [],
  };
};

module.exports.addNewCustomerUtil = async ({ req }) => {
  return {
    status: "success",
    message: `addNewCustomer - ${req}`,
    data: [],
  };
};

module.exports.deleteCustomerUtil = async ({ req }) => {
  return {
    status: "success",
    message: `deleteCustomer - ${req}`,
    data: [],
  };
};
