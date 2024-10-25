const BrandsUtility = require("../../utilities/v3/brandsUtility");

module.exports.getAllBrands = async (req, res) => {
  const foundBrandObject = await BrandsUtility.getAllBrandsUtil({ req });
  res.json(foundBrandObject);
};

module.exports.getBrandByID = async (req, res) => {
  const foundBrandObject = await BrandsUtility.getBrandByBrandIDUtil({ req });
  res.json(foundBrandObject);
};

module.exports.getBrandByTitle = async (req, res) => {
  const foundBrandObject = await BrandsUtility.getBrandByBrandTitleUtil({
    req,
  });
  res.json(foundBrandObject);
};

module.exports.addNewBrand = async (req, res) => {
  const foundBrandObject = await BrandsUtility.addNewBrandUtil({ req });
  res.json(foundBrandObject);
};

module.exports.deleteBrand = async (req, res) => {
  const foundBrandObject = await BrandsUtility.deleteBrandUtil({ req });
  res.json(foundBrandObject);
};

module.exports.updateBrand = async (req, res) => {
  const foundBrandObject = await BrandsUtility.updateBrandUtil({ req });
  res.json(foundBrandObject);
};
