const WishlistUtility = require("../../utilities/v3/wishlistsUtility");

module.exports.getAllWishlists = async (req, res) => {
  const foundWishlistObj = await WishlistUtility.getAllWishlistsUtil({
    req: req,
  });
  res.json(foundWishlistObj);
};

module.exports.getWishlistsByCustomerID = async (req, res) => {
  const foundWishlistObj = await WishlistUtility.getWishlistsByCustomerIDUtil({
    req: req,
  });
  res.json(foundWishlistObj);
};

module.exports.getWishlistsByProductID = async (req, res) => {
  const foundWishlistObj = await WishlistUtility.getWishlistsByProductIDUtil({
    req: req,
  });
  res.json(foundWishlistObj);
};

module.exports.getWishlistByProductAndCustomerID = async (req, res) => {
  const foundWishlistObj =
    await WishlistUtility.getWishlistByProductAndCustomerIDUtil({
      req: req,
    });
  res.json(foundWishlistObj);
};

module.exports.addToWishlist = async (req, res) => {
  const foundWishlistObj = await WishlistUtility.addToWishlistUtil({
    req: req,
  });
  res.json(foundWishlistObj);
};

module.exports.deleteFromWishlist = async (req, res) => {
  const foundWishlistObj = await WishlistUtility.deleteFromWishlistUtil({
    req: req,
  });
  res.json(foundWishlistObj);
};

module.exports.updateWishlist = async (req, res) => {
  const foundWishlistObj = await WishlistUtility.updateWishlistUtil({
    req: req,
  });
  res.json(foundWishlistObj);
};
