const express = require("express");
const router = express.Router();
const contactUs = require("../../controller/v3/contactUs");

router.post("/allContactUsData", contactUs.getAllContactUsData);
router.post("/contactUsDataByID", contactUs.getContactUsDataByID);
router.post("/contactUsPageData", contactUs.getContactUsPageData);
router.post("/addNewContactUsData", contactUs.addNewContactUsData);
router.post("/deleteContactUsData", contactUs.deleteContactUsData);

module.exports = router;
