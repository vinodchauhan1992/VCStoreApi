const express = require("express");
const router = express.Router();
const customers = require("../../controller/v3/customers");

router.post("/allCustomers", customers.getAllCustomers);
router.post("/customerByID", customers.getCustomerByID);
router.post("/addNewCustomer", customers.addNewCustomer);
router.post("/deleteCustomer", customers.deleteCustomer);

module.exports = router;
