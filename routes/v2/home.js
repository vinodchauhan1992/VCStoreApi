const express = require("express");
const router = express.Router();
const home = require("../../controller/v2/home");

router.get("/", home.indexPage);
router.get("/docs", home.docsPage);

module.exports = router;
