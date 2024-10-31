const express = require("express");
const router = express.Router();
const wishlists = require("../../controller/v3/wishlists");

router.post("/allWishlists", wishlists.getAllWishlists);
router.post("/wishlistsByCustomerID", wishlists.getWishlistsByCustomerID);
router.post("/wishlistsByProductID", wishlists.getWishlistsByProductID);
router.post(
  "/wishlistByProductAndCustomerID",
  wishlists.getWishlistByProductAndCustomerID
);
router.post("/addToWishlist", wishlists.addToWishlist);
router.post("/deleteFromWishlist", wishlists.deleteFromWishlist);
router.post("/updateWishlist", wishlists.updateWishlist);

module.exports = router;
