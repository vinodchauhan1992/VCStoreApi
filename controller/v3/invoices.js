const InvoicesUtility = require("../../utilities/v3/invoicesUtility");

module.exports.getAllInvoices = async (req, res) => {
  const foundItemObj = await InvoicesUtility.getAllInvoicesUtil({ req });
  res.json(foundItemObj);
};

module.exports.getInvoiceByInvoiceID = async (req, res) => {
  const foundItemObj = await InvoicesUtility.getInvoiceByInvoiceIDUtil({ req });
  res.json(foundItemObj);
};

module.exports.getInvoiceByInvoiceCode = async (req, res) => {
  const foundItemObj = await InvoicesUtility.getInvoiceByInvoiceCodeUtil({
    req,
  });
  res.json(foundItemObj);
};

module.exports.getInvoiceByOrderID = async (req, res) => {
  const foundItemObj = await InvoicesUtility.getInvoiceByOrderIDUtil({ req });
  res.json(foundItemObj);
};

module.exports.getInvoicesByCustomerID = async (req, res) => {
  const foundItemObj = await InvoicesUtility.getInvoicesByCustomerIDUtil({
    req,
  });
  res.json(foundItemObj);
};

module.exports.generateNewInvoice = async (req, res) => {
  const foundItemObj = await InvoicesUtility.generateNewInvoiceUtil({ req });
  res.json(foundItemObj);
};

module.exports.deleteInvoice = async (req, res) => {
  const foundItemObj = await InvoicesUtility.deleteInvoiceUtil({ req });
  res.json(foundItemObj);
};
