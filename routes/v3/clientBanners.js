const express = require("express");
const router = express.Router();
const clientBanners = require("../../controller/v3/clientBanners");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post("/allClientBanners", clientBanners.getAllClientBanners);
router.post("/clientBannerByID", clientBanners.getClientBannerByID);
router.post("/addClientBanner", upload, clientBanners.addClientBanner);
router.post("/deleteClientBanner", clientBanners.deleteClientBanner);
router.post("/updateClientBanner", upload, clientBanners.updateClientBanner);

module.exports = router;
