const express = require("express");
const router = express.Router();
const clientMisc = require("../../controller/v3/clientMisc");

router.post("/footerSectionData", clientMisc.getFooterSectionData);
router.post("/staticImages", clientMisc.getStaticImages);
router.post("/clientMiscData", clientMisc.getClientMiscData);
router.post("/aboutUsData", clientMisc.getAboutUsData);

module.exports = router;
