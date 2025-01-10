const express = require("express");
const router = express.Router();
const products = require("../../controller/v3/products");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post("/allProducts", products.getAllProducts);
router.post("/productByProductID", products.getProductByProductID);
router.post("/productsByProductTitle", products.getProductsByProductTitle);
router.post("/productsByCategoryID", products.getProductsByCategoryID);
router.post("/productsByBrandID", products.getProductsByBrandID);
router.post("/addNewProduct", upload, products.addNewProduct);
router.post("/deleteProduct", products.deleteProduct);
router.post("/updateProductPhoto", upload, products.updateProductPhoto);
router.post("/updateProductPriceDetails", products.updateProductPriceDetails);
router.post(
  "/updateProductDescriptionDetails",
  products.updateProductDescriptionDetails
);

module.exports = router;
