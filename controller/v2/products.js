const Products = require("../../model/products");
const CommonUtility = require("../../utilities/commonUtility");
const ProductUtility = require("../../utilities/productUtility");
const CategoryUtility = require("../../utilities/categoryUtility");

var dataObject = { status: "success", message: "", data: [] };

module.exports.getAllProducts = async (req, res) => {
  try {
    const foundDataObject = await ProductUtility.getAllProductsData({ req });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: [],
    });
  }
};

module.exports.getProduct = async (req, res) => {
  if (!req?.params?.id || req.params.id === "") {
    res.json({
      status: "error",
      message: "Please send product id to get a product by id.",
      data: {},
    });
    return;
  }
  const productId = req.params.id;

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

module.exports.getProductsInCategory = (req, res) => {
  if (!req?.params?.categoryID || req.params.categoryID === "") {
    dataObject.status = "error";
    dataObject.message =
      "Please send category id to get a product by category id.";
    res.json(dataObject);
  } else {
    const categoryID = req.params.categoryID;
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort == "desc" ? -1 : 1;

    Products.find({
      categoryID,
    })
      .select(["-_id"])
      .limit(limit)
      .sort({ id: sort })
      .then((products) => {
        if (products && products.length > 0) {
          dataObject.message = `Products with category id ${categoryID} fetched successfully.`;
          dataObject.data = products;
        } else {
          dataObject.message = `There are no products exists with category id ${categoryID}.`;
          dataObject.data = [];
        }
        res.json(dataObject);
      })
      .catch((err) => {
        dataObject.status = "error";
        dataObject.message = `There is an error occurred. ${err}`;
        res.json(dataObject);
      });
  }
};

module.exports.addProduct = async (req, res) => {
  if (!req?.body?.title || req.body.title === "") {
    dataObject.status = "error";
    dataObject.message = "Product title is required.";
    res.json(dataObject);
    return;
  }
  if (!req?.body?.description || req.body.description === "") {
    dataObject.status = "error";
    dataObject.message = "Product description is required.";
    res.json(dataObject);
    return;
  }
  if (!req?.body?.categoryID || req.body.categoryID === "") {
    dataObject.status = "error";
    dataObject.message = "Category id is required.";
    res.json(dataObject);
    return;
  }
  if (
    req?.body?.purchasePrice === null ||
    req?.body?.purchasePrice === undefined
  ) {
    dataObject.status = "error";
    dataObject.message = "Purchase price is required.";
    res.json(dataObject);
    return;
  }
  if (
    req?.body?.sellingPrice === null ||
    req?.body?.sellingPrice === undefined
  ) {
    dataObject.status = "error";
    dataObject.message = "Selling price is required.";
    res.json(dataObject);
    return;
  }
  if (
    req?.body?.maxDiscountPercentage === null ||
    req?.body?.maxDiscountPercentage === undefined
  ) {
    dataObject.status = "error";
    dataObject.message = "Max discount percentage is required.";
    res.json(dataObject);
    return;
  }
  if (!req?.body?.brandID || req.body.brandID === "") {
    dataObject.status = "error";
    dataObject.message = "Product brand id is required.";
    res.json(dataObject);
    return;
  }
  if (!req?.body?.brandTitle || req.body.brandTitle === "") {
    dataObject.status = "error";
    dataObject.message = "Product brand title is required.";
    res.json(dataObject);
    return;
  }
  if (!req?.body?.brandCode || req.body.brandCode === "") {
    dataObject.status = "error";
    dataObject.message = "Product brand code is required.";
    res.json(dataObject);
    return;
  }

  const foundCategoryResponse = await CategoryUtility.getCategoryById({
    categoryID: req.body.categoryID,
  });

  if (foundCategoryResponse.status === "error") {
    dataObject.status = "error";
    dataObject.message = "Category id is not valid.";
    res.json(dataObject);
    return;
  }

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
  const brandID = req.body.brandID;
  const brandCode = req.body.brandCode;
  const brandTitle = req.body.brandTitle;

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
      count: 0,
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

module.exports.editProduct = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    dataObject.status = "error";
    dataObject.message = "something went wrong! check your sent data.";
    res.json(dataObject);
  } else {
    res.json({
      id: parseInt(req.params.id),
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

module.exports.deleteProduct = (req, res) => {
  if (req.params.id == null) {
    dataObject.status = "error";
    dataObject.message = "Product id must be provided to delete a product.";
    res.json(dataObject);
  } else {
    Products.findOne({
      id: req.params.id,
    })
      .select(["-_id"])
      .then((product) => {
        if (product && Object.keys(product).length > 0) {
          dataObject.message = `Product with product id ${id} is deleted successfully.`;
          dataObject.data = product;
        } else {
          dataObject.message = `Product with product id ${id} is not deleted.`;
          dataObject.data = {};
        }
        res.json(dataObject);
      })
      .catch((err) => {
        dataObject.status = "error";
        dataObject.message = `There is an error occurred. ${err}`;
        res.json(dataObject);
      });
  }
};
