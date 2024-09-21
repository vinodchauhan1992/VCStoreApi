const Brands = require("../model/brands");
const CommonUtility = require("./commonUtility");
const {
  uploadFileToFirebaseStorage,
  updateUploadedFileInFirebaseStorage,
  deleteUploadedFileInFirebaseStorage,
} = require("./fileManagerUtility");

module.exports.uploadProductBrandImageToFS = async ({
  file,
  brandID,
  brandTitle,
}) => {
  return await uploadFileToFirebaseStorage({
    file,
    parentDocumentID: brandID,
    parentDocumentName: brandTitle,
    imageBasePath: `images/productBrands`,
  });
};

module.exports.getAllProductBrands = async ({ req }) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  return await Brands.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((allProductBrands) => {
      if (allProductBrands && allProductBrands.length > 0) {
        return {
          status: "success",
          message: "Product brands fetched successfully.",
          data: CommonUtility.sortObjectsOfArray(allProductBrands),
        };
      } else {
        return {
          status: "success",
          message:
            "Product brands fetched successfully. But product brands doesn't have any data.",
          data: [],
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getAllProductBrands function in brands utility. ${err}`,
        data: [],
      };
    });
};

module.exports.getProductBrandDataByBrandId = async ({ brandID }) => {
  return await Brands.findOne({
    id: brandID,
  })
    .select(["-_id"])
    .then((productBrand) => {
      if (productBrand && Object.keys(productBrand).length > 0) {
        return {
          status: "success",
          message: `Product brand with brandID ${brandID} fetched successfully.`,
          data: CommonUtility.sortObject(productBrand),
        };
      } else {
        return {
          status: "error",
          message: `There is no product brand exists with brandID ${brandID}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in brands utitlity function. ${err}`,
        data: {},
      };
    });
};

module.exports.addNewProductBrandData = async ({ productBrandSchema, res }) => {
  return await productBrandSchema
    .save()
    .then((respondedProductBrand) => {
      if (
        respondedProductBrand &&
        Object.keys(respondedProductBrand).length > 0
      ) {
        res.json({
          status: "success",
          message: `New product brand is added successfully.`,
          data: respondedProductBrand,
        });
      } else {
        res.json({
          status: "error",
          message: `Product brand is not added due to unknown error.`,
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

module.exports.updateUploadedProductBrandImageToFS = async ({
  file,
  fullPath,
  name,
  fileFolderName,
  fileFolderPath,
  brandID,
  brandTitle,
}) => {
  return await updateUploadedFileInFirebaseStorage({
    file,
    fullPath,
    name,
    fileFolderName,
    fileFolderPath,
    parentDocumentID: brandID,
    parentDocumentName: brandTitle,
  });
};

module.exports.updateExistingProductBrand = async ({
  newProductBrand,
  updatedProductBrandSet,
  brandID,
  res,
}) => {
  return await Brands.updateOne({ id: brandID }, updatedProductBrandSet)
    .then((respondedProductBrand) => {
      if (
        respondedProductBrand &&
        Object.keys(respondedProductBrand).length > 0
      ) {
        res.json({
          status: "success",
          message: `Product brand is updated successfully.`,
          data: newProductBrand,
        });
      } else {
        res.json({
          status: "error",
          message: `Product brand is not updated due to unknown error.`,
          data: {},
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: {},
      });
    });
};

module.exports.deleteUploadedProductBrandImageToFS = async ({ fileUrl }) => {
  return await deleteUploadedFileInFirebaseStorage({
    fileUrl: fileUrl,
  });
};

module.exports.deleteProductBrandData = async ({
  res,
  brandID,
  foundProductBrandResponse,
}) => {
  Brands.deleteOne({
    id: brandID,
  })
    .select(["-_id"])
    .then(async (result) => {
      if (result && result.deletedCount === 1) {
        if (
          foundProductBrandResponse?.data?.brandLogo?.imageUrl &&
          foundProductBrandResponse.data.brandLogo.imageUrl !== ""
        ) {
          const deleteFileResp = await this.deleteUploadedProductBrandImageToFS(
            {
              fileUrl: foundProductBrandResponse?.data?.brandLogo?.imageUrl,
            }
          );
          let msg = `Product brand with brand id ${brandID} is deleted successfully with product brand image.`;
          if (!deleteFileResp.isSucceeded) {
            msg = `Product brand with brand id ${brandID} is deleted successfully but product brand image is not deleted. FileDeletionError: ${deleteFileResp?.message}`;
          }
          res.json({
            status: "success",
            message: msg,
            data: {},
          });
        } else {
          res.json({
            status: "success",
            message: `Product brand with brand id ${brandID} is deleted successfully.`,
            data: {},
          });
        }
      } else {
        res.json({
          status: "error",
          message: `Product brand with brand id ${brandID} is not deleted.`,
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
