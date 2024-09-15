const express = require("express");
const router = express.Router();
const brands = require("../../controller/v2/brands");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.get("/allProductBrands", brands.getAllProductBrands);
router.get("/productBrandByBrandId/:brandID", brands.getProductBrandByBrandId);
router.post("/addProductBrand", upload, brands.addProductBrand);
router.delete("/deleteProductBrand/:brandID", brands.deleteProductBrand);
router.put("/updateProductBrand/:brandID", upload, brands.updateProductBrand);

module.exports = router;
