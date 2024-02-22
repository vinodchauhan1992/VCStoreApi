const express = require("express");
const router = express.Router();
const categories = require("../../controller/v1/categories");

router.get("/getAllCategories", categories.getAllProductCategories);
router.get("/categoryByID/:categoryID", categories.getProductCategory);
router.post("/addProductCategory", categories.addProductCategory);
router.delete(
  "/deleteProductCategory/:categoryID",
  categories.deleteProductCategory
);
router.put(
  "/updateProductCategory/:categoryID",
  categories.updateProductCategory
);

module.exports = router;
