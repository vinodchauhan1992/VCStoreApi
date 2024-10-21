const CategoriesUtility = require("../../utilities/v3/categoriesUtility");

module.exports.getAllProductCategories = async (req, res) => {
  const foundCategoryObj = await CategoriesUtility.getAllProductCategoriesUtil({
    req: req,
  });
  res.json(foundCategoryObj);
};

module.exports.getProductCategoryById = async (req, res) => {
  const foundCategoryObj = await CategoriesUtility.getProductCategoryByIdUtil({
    req: req,
  });
  res.json(foundCategoryObj);
};

module.exports.addProductCategory = async (req, res) => {
  const foundCategoryObj = await CategoriesUtility.addProductCategoryUtil({
    req: req,
  });
  res.json(foundCategoryObj);
};

module.exports.deleteProductCategory = async (req, res) => {
  const foundCategoryObj = await CategoriesUtility.deleteProductCategoryUtil({
    req: req,
  });
  res.json(foundCategoryObj);
};

module.exports.updateProductCategory = async (req, res) => {
  const foundCategoryObj = await CategoriesUtility.updateProductCategoryUtil({
    req: req,
  });
  res.json(foundCategoryObj);
};
