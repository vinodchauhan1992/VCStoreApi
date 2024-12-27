const express = require("express");
const router = express.Router();
const customersLogin = require("../../controller/v3/customersLogin");

router.post("/allCustomerLogins", customersLogin.getAllCustomerLogins);
router.post("/customerLoginsByCustID", customersLogin.getCustomerLoginsByCustID);
router.post(
  "/customerLoginByLoginID",
  customersLogin.getCustomerLoginByLoginID
);
router.post(
  "/customerLoginsByCustUsername",
  customersLogin.getCustomerLoginsByCustUsername
);
router.post(
  "/customerLoginByJwtToken",
  customersLogin.getCustomerLoginByJwtToken
);

module.exports = router;
