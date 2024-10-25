const BrandsSchema = require("../../model/v3/brands");
const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");
const {
  uploadFileToFirebaseStorage,
  updateUploadedFileInFirebaseStorage,
  deleteUploadedFileInFirebaseStorage,
} = require("./fileManagerUtility");

const imageBasePath = `images/brands`;

module.exports.uploadBrandImageToFS = async ({ file, brandID, brandCode }) => {
  return await uploadFileToFirebaseStorage({
    file: file,
    parentDocumentID: brandID,
    parentDocumentName: brandCode,
    imageBasePath: imageBasePath,
  });
};

module.exports.getAllBrandsUtil = async ({ req }) => {
  return await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: BrandsSchema,
    schemaName: "Brands",
    arrSortByKey: "brandNumber",
  });
};

module.exports.getBrandByBrandIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Brand id is required.`,
      data: {},
    };
  }

  const brandID = req.body.id;

  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: BrandsSchema,
    schemaName: "Brand",
    dataID: brandID,
  });
};

module.exports.getBrandByBrandTitleUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: `Brand title is required.`,
      data: {},
    };
  }

  const brandTitle = req.body.title;

  return await CommonApisUtility.getDataByTitleFromSchemaUtil({
    schema: BrandsSchema,
    schemaName: "Brand",
    dataTitle: brandTitle,
  });
};

module.exports.getNewBrandNumberUtil = async ({ req }) => {
  const allItemsObj = await this.getAllBrandsUtil({
    req,
  });
  const dataArr = allItemsObj?.data ?? [];

  let currentMaxItemNumber = 0;

  if (dataArr && dataArr.length > 0) {
    const itemNumbersArr = [];
    dataArr.map((item) => {
      itemNumbersArr.push(item.brandNumber);
    });
    const maxItemNumber = itemNumbersArr.reduce(function (prev, current) {
      return prev && prev > current ? prev : current;
    });
    if (maxItemNumber) {
      currentMaxItemNumber = maxItemNumber ?? 0;
    }
  }
  const newItemNumber = currentMaxItemNumber + 1;
  return newItemNumber;
};

module.exports.addNewBrandUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: `Brand title is required.`,
      data: {},
    };
  }

  const brandTitle = req.body.title;

  const foundBrandByTitle = await this.getBrandByBrandTitleUtil({ req: req });
  if (foundBrandByTitle?.status === "success") {
    return {
      status: "error",
      message: `Brand with brand title ${brandTitle} is already exists. Please update the existing one if needed`,
      data: {},
    };
  }

  const newBrandNumber = await this.getNewBrandNumberUtil({
    req,
  });
  const paddedNewBrandNumber = String(newBrandNumber).padStart(9, "0");
  const code = `Brand${paddedNewBrandNumber}`;
  const brandID = CommonUtility.getUniqueID();
  const dateAdded = new Date();
  const dateModified = new Date();

  let uploadResponse = null;
  let uploadedFileStatus = "no file added";
  let uploadedFileMessage = "";
  let uploadedFileData = {};
  if (req.file) {
    uploadResponse = await this.uploadBrandImageToFS({
      file: req.file,
      brandID: brandID,
      brandCode: code,
    });

    uploadedFileStatus = uploadResponse?.isSucceeded ? "success" : "error";
    uploadedFileMessage = uploadResponse?.message;
    uploadedFileData = uploadResponse?.fileData;
  }

  const newBrandSchema = new BrandsSchema({
    id: brandID,
    brandNumber: newBrandNumber,
    title: brandTitle,
    code: code,
    imageData: uploadedFileData,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  if (req.file) {
    if (uploadResponse.isSucceeded) {
      return await CommonApisUtility.addNewDataToSchemaUtil({
        newSchema: newBrandSchema,
        schemaName: "Brand",
      });
    }
    return {
      status: uploadedFileStatus,
      message: uploadedFileMessage,
      data: uploadedFileData,
    };
  }
  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newBrandSchema,
    schemaName: "Brand",
  });
};

module.exports.deleteUploadedBrandImageToFS = async ({ fileUrl }) => {
  return await deleteUploadedFileInFirebaseStorage({
    fileUrl: fileUrl,
  });
};

module.exports.deleteBrandUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Brand id is required.",
      data: {},
    };
  }

  const brandID = req.body.id;
  const foundBrandByIDObj = await this.getBrandByBrandIDUtil({
    req: req,
  });
  if (foundBrandByIDObj?.status === "error") {
    return foundBrandByIDObj;
  }

  const imageUrl = foundBrandByIDObj?.data?.imageData?.imageUrl ?? null;
  let imageDeletionResponseObj = {
    status: "success",
    message: "",
    data: {},
  };
  if (imageUrl && imageUrl !== "") {
    const deleteFileResp = await this.deleteUploadedBrandImageToFS({
      fileUrl: imageUrl,
    });

    let msg = `Brand image for brand id ${brandID} is deleted successfully.`;
    if (!deleteFileResp.isSucceeded) {
      msg = `Brand image for brand id ${brandID} is not deleted. FileDeletionError: ${deleteFileResp?.message}`;
    }
    imageDeletionResponseObj = {
      status: "success",
      message: msg,
      data: {},
    };
  }

  const deleteApiResponseObj =
    await CommonApisUtility.deleteDataByIdFromSchemaUtil({
      schema: BrandsSchema,
      schemaName: "Brand",
      dataID: brandID,
    });

  return {
    ...deleteApiResponseObj,
    message:
      imageDeletionResponseObj?.message &&
      imageDeletionResponseObj.message !== ""
        ? `${deleteApiResponseObj?.message} and ${imageDeletionResponseObj.message}`
        : deleteApiResponseObj?.message,
  };
};

module.exports.updateUploadedBrandImageToFS = async ({
  file,
  brandID,
  brandCode,
  fullPath,
  name,
  fileFolderName,
  fileFolderPath,
}) => {
  return await updateUploadedFileInFirebaseStorage({
    file: file,
    fullPath: fullPath,
    name: name,
    fileFolderName: fileFolderName,
    fileFolderPath: fileFolderPath,
    parentDocumentID: brandID,
    parentDocumentName: brandCode,
    allowedSizeInMb: 10,
  });
};

module.exports.updateBrandImageInFSUtil = async ({
  brandID,
  brandCode,
  imageData,
  file,
}) => {
  let finalImageData = null;
  if (
    imageData &&
    Object.keys(imageData).length > 0 &&
    imageData?.imageUrl &&
    imageData.imageUrl !== ""
  ) {
    finalImageData = imageData;
  }

  let updatedUploadedResponse = null;
  if (finalImageData) {
    // updated existing image
    updatedUploadedResponse = await this.updateUploadedBrandImageToFS({
      file: file,
      brandID: brandID,
      brandCode: brandCode,
      fullPath: finalImageData?.fullPath,
      name: finalImageData?.name,
      fileFolderName: finalImageData?.fileFolderName,
      fileFolderPath: finalImageData?.fileFolderPath,
    });
  } else {
    // add new image
    updatedUploadedResponse = await this.uploadBrandImageToFS({
      file: file,
      brandID: brandID,
      brandCode: brandCode,
    });
  }

  return {
    status: updatedUploadedResponse?.isSucceeded ? "success" : "error",
    message: updatedUploadedResponse?.isSucceeded
      ? `Brand photo is updated succefully for brand id ${brandID} and brand code ${brandCode}. Error: ${updatedUploadedResponse?.message}`
      : `There is an error occurred. Brand photo cannot be updated for brand id ${brandID} and brand code ${brandCode}. Error: ${updatedUploadedResponse?.message}`,
    data: updatedUploadedResponse?.fileData ?? null,
  };
};

module.exports.updateBrandUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Brand id is required.",
      data: {},
    };
  }

  const brandID = req.body.id;
  let title = req?.body?.title ? req.body.title : "";
  const dateModified = new Date();

  if ((!req?.file || req.file === "") && (!title || title === "")) {
    return {
      status: "error",
      message: `Brand with brand id ${brandID} not updated. Nothing new passed to update.`,
      data: {},
    };
  }

  const foundDataByIdObj = await this.getBrandByBrandIDUtil({
    req: req,
  });
  if (foundDataByIdObj?.status === "error") {
    return foundDataByIdObj;
  }
  if (
    !foundDataByIdObj?.data ||
    Object.keys(foundDataByIdObj.data).length <= 0
  ) {
    return {
      status: "error",
      message: `Brand with brand id ${brandID} not found.`,
      data: {},
    };
  }

  let updatedPhotoObj = {
    data: foundDataByIdObj?.data?.imageData ?? null,
  };
  if (req.file) {
    const file = req.file;

    updatedPhotoObj = await this.updateBrandImageInFSUtil({
      brandID: brandID,
      brandCode: foundDataByIdObj.data.code,
      imageData: foundDataByIdObj.data.imageData,
      file: file,
    });

    if (updatedPhotoObj?.status === "error") {
      return updatedPhotoObj;
    }
  }

  if (!title || title === "") {
    title = foundDataByIdObj?.data?.title ? foundDataByIdObj.data.title : "";
  }

  const newBrandData = {
    id: brandID,
    title: title,
    imageData: updatedPhotoObj.data,
    dateModified: dateModified,
  };

  const updatedBrandDataSet = {
    $set: newBrandData,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: BrandsSchema,
    newDataObject: newBrandData,
    updatedDataSet: updatedBrandDataSet,
    schemaName: "Brand",
    dataID: brandID,
  });
};
