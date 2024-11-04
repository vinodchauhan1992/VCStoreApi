const express = require("express");
const router = express.Router();
const invoices = require("../../controller/v3/invoices");

router.post("/allInvoices", invoices.getAllInvoices);
router.post("/invoiceByInvoiceID", invoices.getInvoiceByInvoiceID);
router.post("/invoiceByInvoiceCode", invoices.getInvoiceByInvoiceCode);
router.post("/invoiceByOrderID", invoices.getInvoiceByOrderID);
router.post("/invoicesByCustomerID", invoices.getInvoicesByCustomerID);
router.post("/generateNewInvoice", invoices.generateNewInvoice);

module.exports = router;
