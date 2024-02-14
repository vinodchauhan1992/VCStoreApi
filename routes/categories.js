const express = require("express");
const router = express.Router();
const categories = require("../controller/categories");

router.get("/getAllCategories", categories.getAllProductCategories);
router.get("/categoryByID/:categoryID", categories.getProductCategory);
router.post("/addProductCategory", categories.addProductCategory);
router.delete("/deleteProductCategory/:id", categories.deleteProductCategory);

module.exports = router;
