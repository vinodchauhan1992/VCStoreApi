const Products = require("../../model/v3/products");
const CommonUtility = require("../../utilities/v3/commonUtility");
const ProductUtility = require("../../utilities/v3/productUtility");
const CategoryUtility = require("../../utilities/v3/categoryUtility");
const BrandsUtility = require("../../utilities/v3/brandsUtility");

// module.exports.getAllProducts = async (req, res) => {};

// module.exports.getProduct = async (req, res) => {};

// module.exports.getProductsInCategory = async (req, res) => {};

// module.exports.addProduct = async (req, res) => {};

// module.exports.updateProductBasicDetails = (req, res) => {};

// module.exports.deleteProduct = async (req, res) => {};

// module.exports.updateCategoryOfProduct = (req, res) => {};

// module.exports.updateBrandOfProduct = (req, res) => {};

// module.exports.updateProductStatus = (req, res) => {};

// module.exports.updateProductPriceDetails = (req, res) => {};

module.exports.getAllProducts = async (req, res) => {
  try {
    const foundDataObject = await ProductUtility.getAllProductsData({ req });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred in catch block in getAllProducts function. ${error.message}`,
      data: [],
    });
  }
};

module.exports.getProduct = async (req, res) => {
  if (!req?.body?.productID || req.body.productID === "") {
    res.json({
      status: "error",
      message: "Product id is required.",
      data: {},
    });
    return;
  }
  const productId = req.body.productID;

  try {
    const foundDataObject = await ProductUtility.getProductDataByProductId({
      productId,
    });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: {},
    });
  }
};

module.exports.getProductsInCategory = async (req, res) => {
  if (!req?.body?.categoryID || req.body.categoryID === "") {
    res.json({
      status: "error",
      message: "Category id is required to get a product by category id.",
      data: [],
    });
    return;
  }

  try {
    const foundDataObject =
      await ProductUtility.getProductsDataByCategoryIdUtil({
        req,
      });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured. ${error}`,
      data: [],
    });
  }
};

module.exports.addProduct = async (req, res) => {
  if (!req?.body?.title || req.body.title === "") {
    res.json({
      status: "error",
      message: "Product title is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.description || req.body.description === "") {
    res.json({
      status: "error",
      message: "Product description is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.categoryID || req.body.categoryID === "") {
    res.json({
      status: "error",
      message: "Category id is required.",
      data: {},
    });
    return;
  }
  if (
    req?.body?.purchasePrice === null ||
    req?.body?.purchasePrice === undefined
  ) {
    res.json({
      status: "error",
      message: "Purchase price is required.",
      data: {},
    });
    return;
  }
  if (
    req?.body?.sellingPrice === null ||
    req?.body?.sellingPrice === undefined
  ) {
    res.json({
      status: "error",
      message: "Selling price is required.",
      data: {},
    });
    return;
  }
  if (
    req?.body?.maxDiscountPercentage === null ||
    req?.body?.maxDiscountPercentage === undefined
  ) {
    res.json({
      status: "error",
      message: "Max discount percentage is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.brandID || req.body.brandID === "") {
    res.json({
      status: "error",
      message: "Product brand id is required.",
      data: {},
    });
    return;
  }

  const foundCategoryResponse = await CategoryUtility.getCategoryById({
    categoryID: req.body.categoryID,
  });

  if (foundCategoryResponse.status === "error") {
    res.json({
      status: "error",
      message: "Category id is not valid.",
      data: {},
    });
    return;
  }

  const brandID = req.body.brandID;
  const foundBrandResponse = await BrandsUtility.getProductBrandDataByBrandId({
    brandID: brandID,
  });

  if (
    foundBrandResponse.status === "error" ||
    !foundBrandResponse?.data?.title ||
    !foundBrandResponse?.data?.code
  ) {
    res.json(foundBrandResponse);
    return;
  }
  const brandCode = foundBrandResponse.data.code;
  const brandTitle = foundBrandResponse.data.title;

  const productID = CommonUtility.getUniqueID();
  const productTitle = req.body.title;
  const purchasePrice = req.body.purchasePrice;
  const sellingPrice = req.body.sellingPrice;
  const profitMargin = sellingPrice - purchasePrice;
  const maxDiscountPercentage = req.body.maxDiscountPercentage;
  const maxDiscountValue = (sellingPrice * maxDiscountPercentage) / 100;
  const profitAfterMaxDiscount =
    sellingPrice - maxDiscountValue - purchasePrice;
  let isProfit = true;
  if (profitAfterMaxDiscount <= 0) {
    isProfit = false;
  }

  let uploadResponse = null;
  let uploadedFileStatus = "no file added";
  let uploadedFileMessage = "";
  let uploadedFileData = {};
  if (req.file) {
    uploadResponse = await ProductUtility.uploadProductImageToFS({
      file: req.file,
      productID: productID,
      productTitle: productTitle,
    });
    uploadedFileStatus = uploadResponse?.isSucceeded ? "success" : "error";
    uploadedFileMessage = uploadResponse?.message;
    uploadedFileData = uploadResponse?.fileData;
  }

  const product = new Products({
    id: productID,
    title: productTitle,
    description: req.body.description,
    categoryDetails: {
      categoryTitle: foundCategoryResponse.data.title,
      categoryCode: foundCategoryResponse.data.code,
      categoryID: req.body.categoryID,
    },
    brandDetails: {
      brandTitle: brandTitle,
      brandCode: brandCode,
      brandID: brandID,
    },
    isActive: req.body.isActive,
    rating: {
      rate: 0.0,
      count: 5.0,
    },
    priceDetails: {
      purchasePrice: purchasePrice,
      sellingPrice: sellingPrice,
      profitMargin: profitMargin,
      maxDiscountPercentage: maxDiscountPercentage,
      maxDiscountValue: maxDiscountValue,
      profitAfterMaxDiscount: profitAfterMaxDiscount,
      isProfit: isProfit,
    },
    imageData: uploadedFileData,
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  if (req.file) {
    if (uploadResponse.isSucceeded) {
      ProductUtility.addNewProduct({
        productSchema: product,
        res: res,
      });
    } else {
      dataObject.status = uploadedFileStatus;
      dataObject.message = uploadedFileMessage;
      dataObject.data = uploadedFileData;
      res.json(dataObject);
    }
  } else {
    ProductUtility.addNewProduct({
      productSchema: product,
      res: res,
    });
  }
};

module.exports.updateProductBasicDetails = (req, res) => {
  if (typeof req.body == undefined || req.body.id == null) {
    dataObject.status = "error";
    dataObject.message = "something went wrong! check your sent data.";
    res.json(dataObject);
  } else {
    res.json({
      id: parseInt(req.body.id),
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      categoryTitle: req.body.categoryTitle,
      categoryCode: req.body.categoryCode,
      categoryID: req.body.categoryID,
      brand: req.body.brand,
      rating: {
        rate: req.body.rate,
        count: req.body.count,
      },
      dateModified: new Date(),
      isActive: req.body.isActive,
      status: req.body.status,
    });
  }
};

module.exports.deleteProduct = async (req, res) => {
  if (!req?.body?.productID || req.body.productID === "") {
    dataObject.status = "error";
    dataObject.message = "Product id is required.";
    res.json({
      status: "error",
      message: "Product id is required to delete a product.",
      data: {},
    });
    return;
  }

  const productID = req.body.productID;

  try {
    const foundProductResponse = await ProductUtility.getProductDataByProductId(
      {
        productId: productID,
      }
    );
    if (
      foundProductResponse?.status &&
      foundProductResponse.status === "success" &&
      foundProductResponse?.data &&
      Object.keys(foundProductResponse.data).length > 0
    ) {
      ProductUtility.deleteProductDataUtil({
        res,
        productID,
        foundProductResponse,
      });
    } else {
      res.json({
        status: "error",
        message: `There is no product exists with product id ${productID}.`,
        data: {},
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: {},
    });
  }
};

module.exports.updateCategoryOfProduct = (req, res) => {
  if (typeof req.body == undefined || req.body.id == null) {
    dataObject.status = "error";
    dataObject.message = "something went wrong! check your sent data.";
    res.json(dataObject);
  } else {
    res.json({
      id: parseInt(req.body.id),
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      categoryTitle: req.body.categoryTitle,
      categoryCode: req.body.categoryCode,
      categoryID: req.body.categoryID,
      brand: req.body.brand,
      rating: {
        rate: req.body.rate,
        count: req.body.count,
      },
      dateModified: new Date(),
      isActive: req.body.isActive,
      status: req.body.status,
    });
  }
};

module.exports.updateBrandOfProduct = (req, res) => {
  if (typeof req.body == undefined || req.body.id == null) {
    dataObject.status = "error";
    dataObject.message = "something went wrong! check your sent data.";
    res.json(dataObject);
  } else {
    res.json({
      id: parseInt(req.body.id),
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      categoryTitle: req.body.categoryTitle,
      categoryCode: req.body.categoryCode,
      categoryID: req.body.categoryID,
      brand: req.body.brand,
      rating: {
        rate: req.body.rate,
        count: req.body.count,
      },
      dateModified: new Date(),
      isActive: req.body.isActive,
      status: req.body.status,
    });
  }
};

module.exports.updateProductStatus = (req, res) => {
  if (typeof req.body == undefined || req.body.id == null) {
    dataObject.status = "error";
    dataObject.message = "something went wrong! check your sent data.";
    res.json(dataObject);
  } else {
    res.json({
      id: parseInt(req.body.id),
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      categoryTitle: req.body.categoryTitle,
      categoryCode: req.body.categoryCode,
      categoryID: req.body.categoryID,
      brand: req.body.brand,
      rating: {
        rate: req.body.rate,
        count: req.body.count,
      },
      dateModified: new Date(),
      isActive: req.body.isActive,
      status: req.body.status,
    });
  }
};

module.exports.updateProductPriceDetails = (req, res) => {
  res.json({
    status: "success",
    message: `updateProductPriceDetails`,
    data: {},
  });
};
