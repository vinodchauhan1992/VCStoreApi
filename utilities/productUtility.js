const Products = require("../model/products");
const {
  uploadFileToFirebaseStorage,
  updateUploadedFileInFirebaseStorage,
  deleteUploadedFileInFirebaseStorage,
} = require("./fileManagerUtility");
const CommonUtility = require("./commonUtility");

module.exports.getAllProductsWithBrandDetails = async ({ allProducts }) => {
  return Promise.all(
    allProducts?.map(async (productData) => {
      const foundBrandObject = await CommonUtility.getBrandDetailsByBrandId({
        brandId: productData.brandDetails.brandID,
      });
      let newBrandDetails = productData.brandDetails;
      if (
        foundBrandObject?.data &&
        Object.keys(foundBrandObject.data).length > 0
      ) {
        newBrandDetails = foundBrandObject.data;
      }
      return {
        productData: productData,
        brandDetails: newBrandDetails,
      };
    })
  );
};

module.exports.getSingleProductWithBrandDetails = async ({ productData }) => {
  const foundBrandObject = await CommonUtility.getBrandDetailsByBrandId({
    brandId: productData.brandDetails.brandID,
  });
  let newBrandDetails = productData.brandDetails;
  if (foundBrandObject?.data && Object.keys(foundBrandObject.data).length > 0) {
    newBrandDetails = foundBrandObject.data;
  }
  return {
    productData: productData,
    brandDetails: newBrandDetails,
  };
};

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
    .then(async (respondedProduct) => {
      if (respondedProduct && Object.keys(respondedProduct).length > 0) {
        const returnedData = await this.getSingleProductWithBrandDetails({
          productData: respondedProduct,
        });
        res.json({
          status: "success",
          message: `New product is added successfully.`,
          data: returnedData,
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
        message: `There is an error occurred in product utility in addNewProduct function. ${error.message}`,
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
    .then(async (respondedProducts) => {
      if (respondedProducts && respondedProducts.length > 0) {
        const fullDetailsProducts = await this.getAllProductsWithBrandDetails({
          allProducts: CommonUtility.sortObjectsOfArray(respondedProducts),
        });
        return {
          status: "success",
          message: "Products fetched successfully.",
          data: fullDetailsProducts,
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
    .then(async (product) => {
      if (product && Object.keys(product).length > 0) {
        const returnedData = await this.getSingleProductWithBrandDetails({
          productData: CommonUtility.sortObject(product),
        });
        return {
          status: "success",
          message: `Product with product id ${productId} fetched successfully.`,
          data: returnedData,
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

module.exports.deleteUploadedProductImageToFS = async ({ fileUrl }) => {
  return await deleteUploadedFileInFirebaseStorage({
    fileUrl: fileUrl,
  });
};

module.exports.deleteProductDataUtil = async ({
  res,
  productID,
  foundProductResponse,
}) => {
  Products.deleteOne({
    id: productID,
  })
    .select(["-_id"])
    .then(async (result) => {
      if (result && result.deletedCount === 1) {
        if (
          foundProductResponse?.data?.productData?.imageData?.imageUrl &&
          foundProductResponse.data.productData.imageData.imageUrl !== ""
        ) {
          const deleteFileResp = await this.deleteUploadedProductImageToFS({
            fileUrl: foundProductResponse.data.productData.imageData.imageUrl,
          });
          let msg = `Product with product id ${productID} is deleted successfully with product image.`;
          if (!deleteFileResp.isSucceeded) {
            msg = `Product with product id ${productID} is deleted successfully but product image is not deleted. FileDeletionError: ${deleteFileResp?.message}`;
          }
          res.json({
            status: "success",
            message: msg,
            data: {},
          });
        } else {
          res.json({
            status: "success",
            message: `Product with product id ${productID} is deleted successfully.`,
            data: {},
          });
        }
      } else {
        res.json({
          status: "error",
          message: `Product brand with brand id ${productID} is not deleted.`,
          data: {},
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${err.message}`,
        data: {},
      });
    });
};

module.exports.getProductsDataByCategoryIdUtil = async ({ req }) => {
  const categoryID = req.params.categoryID;
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  return await Products.find({
    "categoryDetails.categoryID": categoryID,
  })
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then(async (products) => {
      if (products && products.length > 0) {
        const fullDetailsProducts = await this.getAllProductsWithBrandDetails({
          allProducts: CommonUtility.sortObjectsOfArray(products),
        });
        return {
          status: "success",
          message: `Products with category id ${categoryID} fetched successfully.`,
          data: fullDetailsProducts,
        };
      } else {
        return {
          status: "error",
          message: `There are no products exists with category id ${categoryID}.`,
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
