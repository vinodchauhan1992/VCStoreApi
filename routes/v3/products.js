const express = require("express");
const router = express.Router();
const products = require("../../controller/v3/products");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.get("/allProducts", products.getAllProducts);
router.get("/productByCategoryID/:categoryID", products.getProductsInCategory);
router.get("/productByID/:productID", products.getProduct);
router.post("/addProduct", upload, products.addProduct);
router.put(
  "/updateProductBasicDetails/:productID",
  upload,
  products.updateProductBasicDetails
);
router.delete("/deleteProduct/:productID", products.deleteProduct);
router.put(
  "/updateCategoryOfProduct/:productID",
  products.updateCategoryOfProduct
);
router.put("/updateBrandOfProduct/:productID", products.updateBrandOfProduct);
router.put("/updateProductStatus/:productID", products.updateProductStatus);
router.put(
  "/updateProductPriceDetails/:productID",
  products.updateProductPriceDetails
);
router.put("/updateProductRating/:productID", products.updateProductRating);

module.exports = router;
