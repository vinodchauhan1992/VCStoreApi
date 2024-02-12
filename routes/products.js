const express = require("express");
const router = express.Router();
const products = require("../controller/products");

router.get("/getAllProducts", products.getAllProducts);
router.get(
  "/getProductByCategoryID/:categoryID",
  products.getProductsInCategory
);
router.get("/productByID/:id", products.getProduct);
router.post("/addProduct", products.addProduct);
router.put("/updateProduct/:id", products.editProduct);
router.patch("/patchProduct/:id", products.editProduct);
router.delete("/deleteProduct/:id", products.deleteProduct);

module.exports = router;
