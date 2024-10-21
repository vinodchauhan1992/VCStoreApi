const express = require("express");
const router = express.Router();
const customers = require("../../controller/v3/customers");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post("/allCustomers", customers.getAllCustomers);
router.post("/customerByID", customers.getCustomerByID);
router.post("/customerByCustomerCode", customers.getCustomerByCustomerCode);
router.post("/customerByUsername", customers.getCustomerByUsername);
router.post("/customerByEmail", customers.getCustomerByEmail);
router.post("/customerByPhone", customers.getCustomerByPhone);
router.post("/addNewCustomer", upload, customers.addNewCustomer);
router.post("/registerNewCustomer", upload, customers.registerNewCustomer);
router.post("/deleteCustomer", customers.deleteCustomer);
router.post("/updateCustomerPhoto", upload, customers.updateCustomerPhoto);
router.post("/updateCustomerName", customers.updateCustomerName);
router.post("/updateCustomerAddress", customers.updateCustomerAddress);
router.post("/updateCustomerPhone", customers.updateCustomerPhone);
router.post("/updateCustomerGender", customers.updateCustomerGender);
router.post("/updateCustomerStatus", customers.updateCustomerStatus);
router.post("/updateCustomerDob", customers.updateCustomerDob);
router.post(
  "/updateCustomerMonthlyIncome",
  customers.updateCustomerMonthlyIncome
);

module.exports = router;
