const express = require("express");
const router = express.Router();
const auth = require("../../controller/v1/auth");

router.post("/login", auth.login);

module.exports = router;
