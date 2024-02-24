const express = require("express");
const router = express.Router();
const categories = require("../../controller/v2/categories");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.get("/getAllCategories", categories.getAllProductCategories);
router.get("/categoryByID/:categoryID", categories.getProductCategory);
router.post("/addProductCategory", upload, categories.addProductCategory);
router.delete(
  "/deleteProductCategory/:categoryID",
  categories.deleteProductCategory
);
router.put(
  "/updateProductCategory/:categoryID",
  upload,
  categories.updateProductCategory
);

module.exports = router;
