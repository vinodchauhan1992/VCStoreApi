const express = require("express");
const router = express.Router();
const products = require("../../controller/v2/products");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.get("/getAllProducts", products.getAllProducts);
router.get(
  "/getProductByCategoryID/:categoryID",
  products.getProductsInCategory
);
router.get("/productByID/:id", products.getProduct);
router.post("/addProduct", upload, products.addProduct);
router.put("/updateProduct/:id", products.editProduct);
router.patch("/patchProduct/:id", products.editProduct);
router.delete("/deleteProduct/:id", products.deleteProduct);

module.exports = router;
