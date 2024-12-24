const express = require("express");
const router = express.Router();
const clientLandingPage = require("../../controller/v3/clientLandingPage");

router.post(
  "/clientLandingPageData",
  clientLandingPage.getClientLandingPageData
);

module.exports = router;
