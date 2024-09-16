const Products = require("../model/products");
const {
  uploadFileToFirebaseStorage,
  updateUploadedFileInFirebaseStorage,
  deleteUploadedFileInFirebaseStorage,
} = require("./fileManagerUtility");

module.exports.uploadProductImageToFS = async ({
  file,
  productID,
  productTitle,
}) => {
  return await uploadFileToFirebaseStorage({
    file,
    parentDocumentID: productID,
    parentDocumentName: productTitle,
    imageBasePath: `images/products`,
  });
};

module.exports.addNewProduct = async ({ productSchema, res }) => {
  return await productSchema
    .save()
    .then((respondedProduct) => {
      if (respondedProduct && Object.keys(respondedProduct).length > 0) {
        res.json({
          status: "success",
          message: `New product is added successfully.`,
          data: respondedProduct,
        });
      } else {
        res.json({
          status: "error",
          message: `Product is not added due to unknown error.`,
          data: {},
        });
      }
    })
    .catch((error) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${error.message}`,
        data: {},
      });
    });
};

module.exports.getAllProductsData = async ({ req }) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  return await Products.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((respondedProducts) => {
      if (respondedProducts && respondedProducts.length > 0) {
        return {
          status: "success",
          message: "Products fetched successfully.",
          data: respondedProducts,
        };
      } else {
        return {
          status: "success",
          message:
            "Products fetched successfully. But products doesn't have any data.",
          data: [],
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: [],
      };
    });
};

module.exports.getProductDataByProductId = async ({ productId }) => {
  return await Products.findOne({
    id: productId,
  })
    .select(["-_id"])
    .then((product) => {
      if (product && Object.keys(product).length > 0) {
        return {
          status: "success",
          message: `Product with product id ${productId} fetched successfully.`,
          data: product,
        };
      } else {
        return {
          status: "error",
          message: `There is no product exists with product id ${productId}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: {},
      };
    });
};
