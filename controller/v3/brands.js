const Brands = require("../../model/v3/brands");
const CommonUtility = require("../../utilities/v3/commonUtility");
const BrandsUtility = require("../../utilities/v3/brandsUtility");

module.exports.getAllProductBrands = async (req, res) => {
  try {
    const foundDataObject = await BrandsUtility.getAllProductBrands({ req });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: [],
    });
  }
};

module.exports.getProductBrandByBrandId = async (req, res) => {
  if (!req?.body?.brandID || req.body.brandID === "") {
    res.json({
      status: "error",
      message: "Product brand id is required",
      data: {},
    });
    return;
  }
  const brandID = req.body.brandID;

  const foundProductBrandResponse =
    await BrandsUtility.getProductBrandDataByBrandId({
      brandID,
    });
  res.json(foundProductBrandResponse);
};

module.exports.addProductBrand = async (req, res) => {
  if (!req?.body?.title || req.body.title === "") {
    res.json({
      status: "error",
      message: "Product brand title is required.",
      data: null,
    });
    return;
  }
  if (!req?.body?.description || req.body.description === "") {
    res.json({
      status: "error",
      message: "Product brand description is required.",
      data: null,
    });
    return;
  }

  const brandID = CommonUtility.getUniqueID();
  const brandTitle = req.body.title;
  const brandDescription = req.body.description;
  const isActive = req?.body?.isActive ?? false;

  let uploadResponse = null;
  let uploadedFileStatus = "no file added";
  let uploadedFileMessage = "";
  let uploadedFileData = {};
  if (req.file) {
    uploadResponse = await BrandsUtility.uploadProductBrandImageToFS({
      file: req.file,
      brandID: brandID,
      brandTitle: brandTitle,
    });

    uploadedFileStatus = uploadResponse?.isSucceeded ? "success" : "error";
    uploadedFileMessage = uploadResponse?.message;
    uploadedFileData = uploadResponse?.fileData;
  }

  const productBrand = new Brands({
    id: brandID,
    title: brandTitle,
    code: brandTitle.toLowerCase(),
    description: brandDescription,
    brandLogo: uploadedFileData,
    isActive: isActive,
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  if (req.file) {
    if (uploadResponse.isSucceeded) {
      BrandsUtility.addNewProductBrandData({
        productBrandSchema: productBrand,
        res: res,
      });
    } else {
      res.json({
        status: uploadedFileStatus,
        message: uploadedFileMessage,
        data: uploadedFileData,
      });
    }
  } else {
    BrandsUtility.addNewProductBrandData({
      productBrandSchema: productBrand,
      res: res,
    });
  }
};

module.exports.deleteProductBrand = async (req, res) => {
  if (!req.body.brandID || req.body.brandID === "") {
    res.json({
      status: "error",
      message: "Product brand id is required.",
      data: {},
    });
    return;
  }

  const brandID = req.body.brandID;

  try {
    const foundProductBrandResponse =
      await BrandsUtility.getProductBrandDataByBrandId({
        brandID,
      });

    if (
      foundProductBrandResponse?.status &&
      foundProductBrandResponse.status === "success" &&
      foundProductBrandResponse?.data &&
      Object.keys(foundProductBrandResponse.data).length > 0
    ) {
      BrandsUtility.deleteProductBrandData({
        res,
        brandID,
        foundProductBrandResponse,
      });
    } else {
      res.json({
        status: "error",
        message: `There is no product brand exists with brandID ${brandID}.`,
        data: {},
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${err.message}`,
      data: {},
    });
  }
};

module.exports.updateProductBrand = async (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "Send all required data to update a product brand.",
      data: {},
    });
    return;
  }
  if (!req?.body?.id || req.body.id === "") {
    res.json({
      status: "error",
      message: "Id is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.title || req.body.title === "") {
    res.json({
      status: "error",
      message: "Title in required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.description || req.body.description === "") {
    res.json({
      status: "error",
      message: "Description is required.",
      data: {},
    });
    return;
  }

  const brandID = req.body.id;
  const brandTitle = req.body.title;
  const brandDescription = req.body.description;
  const isActive = req?.body?.isActive ?? false;
  let finalBrandLogoData = null;
  if (req?.body?.brandLogo && req.body.brandLogo !== "") {
    const localBrandLogoData = JSON.parse(JSON.parse(req.body.brandLogo));
    if (localBrandLogoData && Object.keys(localBrandLogoData).length > 1) {
      finalBrandLogoData = localBrandLogoData;
    }
  }

  try {
    const foundProductBrandResponse =
      await BrandsUtility.getProductBrandDataByBrandId({
        brandID,
      });
    if (
      foundProductBrandResponse?.status &&
      foundProductBrandResponse.status === "success" &&
      foundProductBrandResponse?.data &&
      Object.keys(foundProductBrandResponse.data).length > 0
    ) {
      let updatedUploadedResponse = null;
      let updatedUploadedFileStatus = "no file added";
      let updatedUploadedFileMessage = "";
      let updatedUploadedFileData = null;
      if (req.file) {
        if (
          finalBrandLogoData &&
          Object.keys(finalBrandLogoData).length > 1 &&
          finalBrandLogoData?.fullPath &&
          finalBrandLogoData.fullPath !== "" &&
          finalBrandLogoData?.imageUrl &&
          finalBrandLogoData.imageUrl !== "" &&
          finalBrandLogoData?.name &&
          finalBrandLogoData.name !== "" &&
          finalBrandLogoData?.fileFolderName &&
          finalBrandLogoData.fileFolderName !== "" &&
          finalBrandLogoData?.fileFolderPath &&
          finalBrandLogoData.fileFolderPath !== ""
        ) {
          // updated existing image
          updatedUploadedResponse =
            await BrandsUtility.updateUploadedProductBrandImageToFS({
              file: req.file,
              brandID: brandID,
              brandTitle: brandTitle,
              fullPath: finalBrandLogoData.fullPath,
              name: finalBrandLogoData.name,
              fileFolderName: finalBrandLogoData.fileFolderName,
              fileFolderPath: finalBrandLogoData.fileFolderPath,
            });
        } else {
          // add new image
          updatedUploadedResponse =
            await BrandsUtility.uploadProductBrandImageToFS({
              file: req.file,
              brandID: brandID,
              brandTitle: brandTitle,
            });
        }
        updatedUploadedFileStatus = updatedUploadedResponse?.isSucceeded
          ? "success"
          : "error";
        updatedUploadedFileMessage = updatedUploadedResponse?.message;
        updatedUploadedFileData = updatedUploadedResponse?.fileData;
      }
      const newProductBrand = {
        id: brandID,
        title: brandTitle,
        code: brandTitle.toLowerCase(),
        description: brandDescription,
        brandLogo: updatedUploadedFileData
          ? updatedUploadedFileData
          : finalBrandLogoData,
        isActive: isActive,
        dateAdded: req.body.dateAdded,
        dateModified: new Date(),
      };

      const updatedProductBrandSet = {
        $set: newProductBrand,
      };

      if (req.file) {
        if (updatedUploadedResponse.isSucceeded) {
          BrandsUtility.updateExistingProductBrand({
            newProductBrand: newProductBrand,
            updatedProductBrandSet: updatedProductBrandSet,
            brandID: brandID,
            res: res,
          });
        } else {
          res.json({
            status: updatedUploadedFileStatus,
            message: updatedUploadedFileMessage,
            data: updatedUploadedFileData,
          });
        }
      } else {
        BrandsUtility.updateExistingProductBrand({
          newProductBrand: newProductBrand,
          updatedProductBrandSet: updatedProductBrandSet,
          brandID: brandID,
          res: res,
        });
      }
    } else {
      res.json({
        status: "error",
        message: `There is no product brand exists with brandID ${brandID}.`,
        data: {},
      });
      return;
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${err}`,
      data: {},
    });
  }
};
