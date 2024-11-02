const express = require("express");
const router = express.Router();
const carts = require("../../controller/v3/carts");

router.post("/allCarts", carts.getAllCarts);
router.post("/cartByCustomerID", carts.getCartByCustomerID);
router.post("/cartByCartID", carts.getCartByCartID);
router.post("/deleteFromCart", carts.deleteFromCart);
router.post("/deleteCart", carts.deleteCart);
router.post("/removeFromCart", carts.removeFromCart);
router.post("/updateCart", carts.updateCart);
router.post("/createCart", carts.createCart);

module.exports = router;
