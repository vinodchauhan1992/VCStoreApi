const express = require("express");
const router = express.Router();
const clientHomePage = require("../../controller/v3/clientHomePage");

router.post("/clientHomePageData", clientHomePage.getClientHomePageData);

module.exports = router;
