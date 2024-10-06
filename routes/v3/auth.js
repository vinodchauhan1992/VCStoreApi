const express = require("express");
const router = express.Router();
const auth = require("../../controller/v3/auth");

router.post("/login", auth.login);
router.post("/employeeLogin", auth.employeeLogin);
router.post("/customerLogin", auth.customerLogin);

module.exports = router;
