const express = require("express");
const router = express.Router();
const brands = require("../../controller/v3/brands");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post("/allBrands", brands.getAllBrands);
router.post("/brandByID", brands.getBrandByID);
router.post("/brandByTitle", brands.getBrandByTitle);
router.post("/addNewBrand", upload, brands.addNewBrand);
router.post("/deleteBrand", brands.deleteBrand);
router.post("/updateBrand", upload, brands.updateBrand);

module.exports = router;
