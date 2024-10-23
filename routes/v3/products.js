const express = require("express");
const router = express.Router();
const products = require("../../controller/v3/products");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post("/allProducts", products.getAllProducts);
router.post("/productByCategoryID", products.getProductsInCategory);
router.post("/productByID", products.getProduct);
router.post("/addProduct", upload, products.addProduct);
router.post(
  "/updateProductBasicDetails",
  upload,
  products.updateProductBasicDetails
);
router.post("/deleteProduct", products.deleteProduct);
router.post("/updateCategoryOfProduct", products.updateCategoryOfProduct);
router.post("/updateBrandOfProduct", products.updateBrandOfProduct);
router.post("/updateProductStatus", products.updateProductStatus);
router.post("/updateProductPriceDetails", products.updateProductPriceDetails);

module.exports = router;
