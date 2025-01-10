const ProductsUtility = require("../../utilities/v3/productsUtility");

module.exports.getAllProducts = async (req, res) => {
  const foundProductObj = await ProductsUtility.getAllProductsUtil({
    req: req,
  });
  res.json(foundProductObj);
};

module.exports.getProductByProductID = async (req, res) => {
  const foundProductObj = await ProductsUtility.getProductByProductIDUtil({
    req: req,
  });
  res.json(foundProductObj);
};

module.exports.getProductsByProductTitle = async (req, res) => {
  const foundProductObj = await ProductsUtility.getProductsByProductTitleUtil({
    req: req,
  });
  res.json(foundProductObj);
};

module.exports.getProductsByCategoryID = async (req, res) => {
  const foundProductObj = await ProductsUtility.getProductsByCategoryIDUtil({
    req: req,
  });
  res.json(foundProductObj);
};

module.exports.getProductsByBrandID = async (req, res) => {
  const foundProductObj = await ProductsUtility.getProductsByBrandIDUtil({
    req: req,
  });
  res.json(foundProductObj);
};

module.exports.addNewProduct = async (req, res) => {
  const foundProductObj = await ProductsUtility.addNewProductUtil({
    req: req,
  });
  res.json(foundProductObj);
};

module.exports.deleteProduct = async (req, res) => {
  const foundProductObj = await ProductsUtility.deleteProductUtil({
    req: req,
  });
  res.json(foundProductObj);
};

module.exports.updateProductPhoto = async (req, res) => {
  const foundProductObj = await ProductsUtility.updateProductPhotoUtil({
    req: req,
  });
  res.json(foundProductObj);
};

module.exports.updateProductDescriptionDetails = async (req, res) => {
  const foundProductObj =
    await ProductsUtility.updateProductDescriptionDetailsUtil({
      req: req,
    });
  res.json(foundProductObj);
};

module.exports.updateProductPriceDetails = async (req, res) => {
  const foundProductObj = await ProductsUtility.updateProductPriceDetailsUtil({
    req: req,
  });
  res.json(foundProductObj);
};
