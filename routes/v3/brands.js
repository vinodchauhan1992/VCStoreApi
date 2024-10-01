const express = require("express");
const router = express.Router();
const brands = require("../../controller/v3/brands");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post("/allProductBrands", brands.getAllProductBrands);
router.post("/productBrandByBrandId", brands.getProductBrandByBrandId);
router.post("/addProductBrand", upload, brands.addProductBrand);
router.post("/deleteProductBrand", brands.deleteProductBrand);
router.post("/updateProductBrand", upload, brands.updateProductBrand);

module.exports = router;
