const CartsUtility = require("../../utilities/v3/cartsUtility");

module.exports.getAllCarts = async (req, res) => {
  const foundCartObj = await CartsUtility.getAllCartsUtil({
    req: req,
  });
  res.json(foundCartObj);
};

module.exports.getCartByCustomerID = async (req, res) => {
  const foundCartObj = await CartsUtility.getCartByCustomerIDUtil({
    req: req,
  });
  res.json(foundCartObj);
};

module.exports.getCartByCartID = async (req, res) => {
  const foundCartObj = await CartsUtility.getCartByCartIDUtil({
    req: req,
  });
  res.json(foundCartObj);
};

module.exports.deleteFromCart = async (req, res) => {
  const foundCartObj = await CartsUtility.deleteFromCartUtil({
    req: req,
  });
  res.json(foundCartObj);
};

module.exports.removeFromCart = async (req, res) => {
  const foundCartObj = await CartsUtility.removeFromCartUtil({
    req: req,
  });
  res.json(foundCartObj);
};

module.exports.updateCart = async (req, res) => {
  const foundCartObj = await CartsUtility.updateCartUtil({
    req: req,
  });
  res.json(foundCartObj);
};
