const express = require("express");
const router = express.Router();
const auth = require("../../controller/v3/auth");

router.post("/employeeLogin", auth.employeeLogin);
router.post("/customerLogin", auth.customerLogin);
router.post("/employeeLogout", auth.employeeLogout);
router.post("/customerLogout", auth.customerLogout);
router.post("/changePassword", auth.changePassword);

module.exports = router;
