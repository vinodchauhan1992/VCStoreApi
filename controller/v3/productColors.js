const ProductColorsUtility = require("../../utilities/v3/productColorsUtility");

module.exports.getAllProductColors = async (req, res) => {
  const foundProductColorObj =
    await ProductColorsUtility.getAllProductColorsUtil({ req: req });
  res.json(foundProductColorObj);
};

module.exports.getProductColorByProductColorId = async (req, res) => {
  const foundProductColorObj =
    await ProductColorsUtility.getProductColorByProductColorIdUtil({
      req: req,
    });
  res.json(foundProductColorObj);
};

module.exports.addNewProductColor = async (req, res) => {
  const foundProductColorObj =
    await ProductColorsUtility.addNewProductColorUtil({
      req: req,
    });
  res.json(foundProductColorObj);
};

module.exports.updateProductColor = async (req, res) => {
  const foundProductColorObj =
    await ProductColorsUtility.updateProductColorUtil({
      req: req,
    });
  res.json(foundProductColorObj);
};

module.exports.deleteProductColor = async (req, res) => {
  const foundProductColorObj =
    await ProductColorsUtility.deleteProductColorUtil({
      req: req,
    });
  res.json(foundProductColorObj);
};
