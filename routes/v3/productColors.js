const express = require("express");
const router = express.Router();
const productColors = require("../../controller/v3/productColors");

router.post("/allProductColors", productColors.getAllProductColors);
router.post(
  "/productColorByProductColorId",
  productColors.getProductColorByProductColorId
);
router.post("/addNewProductColor", productColors.addNewProductColor);
router.post("/updateProductColor", productColors.updateProductColor);
router.post("/deleteProductColor", productColors.deleteProductColor);

module.exports = router;
