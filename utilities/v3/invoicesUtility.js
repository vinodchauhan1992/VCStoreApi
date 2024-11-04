const InvoicesSchema = require("../../model/v3/invoices");
const CommonApisUtility = require("../../utilities/v3/commonApisUtility");
const CommonUtility = require("../../utilities/v3/commonUtility");

module.exports.getAllInvoicesUtil = async ({ req }) => {
  return {
    status: "error",
    message: `getAllInvoicesUtil`,
    data: [],
  };
};

module.exports.getInvoiceByInvoiceIDUtil = async ({ req }) => {
  return {
    status: "error",
    message: `getInvoiceByInvoiceIDUtil`,
    data: {},
  };
};

module.exports.getInvoiceByInvoiceCodeUtil = async ({ req }) => {
  return {
    status: "error",
    message: `getInvoiceByInvoiceCodeUtil`,
    data: {},
  };
};

module.exports.getInvoiceByOrderIDUtil = async ({ req }) => {
  return {
    status: "error",
    message: `getInvoiceByOrderIDUtil`,
    data: {},
  };
};

module.exports.getInvoicesByCustomerIDUtil = async ({ req }) => {
  return {
    status: "error",
    message: `getInvoicesByCustomerIDUtil`,
    data: [],
  };
};

module.exports.generateNewInvoiceUtil = async ({ req }) => {
  return {
    status: "error",
    message: `generateNewInvoiceUtil`,
    data: {},
  };
};
