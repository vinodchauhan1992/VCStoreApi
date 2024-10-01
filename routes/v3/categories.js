const express = require("express");
const router = express.Router();
const categories = require("../../controller/v3/categories");
const multer = require("multer");

/// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post("/getAllCategories", categories.getAllProductCategories);
router.post("/categoryByID", categories.getProductCategoryById);
router.post("/addProductCategory", upload, categories.addProductCategory);
router.post("/deleteProductCategory", categories.deleteProductCategory);
router.post("/updateProductCategory", upload, categories.updateProductCategory);

module.exports = router;
