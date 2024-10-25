const CategoriesSchema = require("../../model/v3/categories");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");
const {
  uploadFileToFirebaseStorage,
  deleteUploadedFileInFirebaseStorage,
  updateUploadedFileInFirebaseStorage,
} = require("./fileManagerUtility");

const imageBasePath = `images/categories`;

module.exports.uploadProductCategoryImageToFS = async ({
  file,
  categoryID,
  categoryCode,
}) => {
  return await uploadFileToFirebaseStorage({
    file: file,
    parentDocumentID: categoryID,
    parentDocumentName: categoryCode,
    imageBasePath: imageBasePath,
  });
};

module.exports.getAllProductCategoriesUtil = async ({ req }) => {
  return await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: CategoriesSchema,
    schemaName: "Categories",
    arrSortByKey: "categoryNumber",
  });
};

module.exports.getProductCategoryByIdUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Category id is required.",
      data: {},
    };
  }

  const categoryID = req.body.id;

  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CategoriesSchema,
    schemaName: "Category",
    dataID: categoryID,
  });
};

module.exports.getNewProductCategoryNumberUtil = async ({ req }) => {
  const allProductCategoriesObj = await this.getAllProductCategoriesUtil({
    req,
  });
  const dataArr = allProductCategoriesObj?.data ?? [];

  let currentMaxCategoryNumber = 0;

  if (dataArr && dataArr.length > 0) {
    const categoryNumbersArr = [];
    dataArr.map((categoryData) => {
      categoryNumbersArr.push(categoryData.categoryNumber);
    });
    const maxCategoryNumber = categoryNumbersArr.reduce(function (
      prev,
      current
    ) {
      return prev && prev > current ? prev : current;
    });
    if (maxCategoryNumber) {
      currentMaxCategoryNumber = maxCategoryNumber ?? 0;
    }
  }
  const newCategoryNumber = currentMaxCategoryNumber + 1;
  return newCategoryNumber;
};

module.exports.addProductCategoryUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: "Category title is required.",
      data: {},
    };
  }
  if (!req?.body?.description || req.body.description === "") {
    return {
      status: "error",
      message: "Category description is required.",
      data: {},
    };
  }

  const title = req.body.title;

  const foundCatByTitle = await CommonApisUtility.getDataByTitleFromSchemaUtil({
    schema: CategoriesSchema,
    schemaName: "Category",
    dataTitle: title,
  });

  if (foundCatByTitle?.status === "success") {
    return {
      status: "error",
      message: `Category with title "${title}" is already exists. You can update that category`,
      data: {},
    };
  }

  const newCategoryNumber = await this.getNewProductCategoryNumberUtil({
    req,
  });
  const paddedNewCategoryNumber = String(newCategoryNumber).padStart(5, "0");
  const code = `Cat${paddedNewCategoryNumber}`;
  const categoryID = CommonUtility.getUniqueID();
  const description = req.body.description;
  const dateAdded = new Date();
  const dateModified = new Date();

  let uploadResponse = null;
  let uploadedFileStatus = "no file added";
  let uploadedFileMessage = "";
  let uploadedFileData = {};
  if (req.file) {
    uploadResponse = await this.uploadProductCategoryImageToFS({
      file: req.file,
      categoryID: categoryID,
      categoryCode: code,
    });

    uploadedFileStatus = uploadResponse?.isSucceeded ? "success" : "error";
    uploadedFileMessage = uploadResponse?.message;
    uploadedFileData = uploadResponse?.fileData;
  }

  const newCategorySchema = new CategoriesSchema({
    id: categoryID,
    categoryNumber: newCategoryNumber,
    code: code,
    imageData: uploadedFileData,
    title: title,
    description: description,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  if (req.file) {
    if (uploadResponse.isSucceeded) {
      return await CommonApisUtility.addNewDataToSchemaUtil({
        newSchema: newCategorySchema,
        schemaName: "Category",
      });
    }
    return {
      status: uploadedFileStatus,
      message: uploadedFileMessage,
      data: uploadedFileData,
    };
  }
  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newCategorySchema,
    schemaName: "Category",
  });
};

module.exports.deleteUploadedCategoryImageToFS = async ({ fileUrl }) => {
  return await deleteUploadedFileInFirebaseStorage({
    fileUrl: fileUrl,
  });
};

module.exports.deleteProductCategoryUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Category id is required.",
      data: {},
    };
  }

  const categoryID = req.body.id;
  const foundCategoryByIDObj = await this.getProductCategoryByIdUtil({
    req: req,
  });
  if (foundCategoryByIDObj?.status === "error") {
    return foundCategoryByIDObj;
  }

  const imageUrl = foundCategoryByIDObj?.data?.imageData?.imageUrl ?? null;
  let imageDeletionResponseObj = {
    status: "success",
    message: "",
    data: {},
  };
  if (imageUrl && imageUrl !== "") {
    const deleteFileResp = await this.deleteUploadedCategoryImageToFS({
      fileUrl: imageUrl,
    });

    let msg = `Category image for category id ${categoryID} is deleted successfully.`;
    if (!deleteFileResp.isSucceeded) {
      msg = `Category image for category id ${categoryID} is not deleted. FileDeletionError: ${deleteFileResp?.message}`;
    }
    imageDeletionResponseObj = {
      status: "success",
      message: msg,
      data: {},
    };
  }

  const deleteApiResponseObj =
    await CommonApisUtility.deleteDataByIdFromSchemaUtil({
      schema: CategoriesSchema,
      schemaName: "Category",
      dataID: categoryID,
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

module.exports.updateUploadedCategoryImageToFS = async ({
  file,
  categoryID,
  categoryCode,
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
    parentDocumentID: categoryID,
    parentDocumentName: categoryCode,
    allowedSizeInMb: 10,
  });
};

module.exports.updateCategoryImageInFSUtil = async ({
  categoryID,
  categoryCode,
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
    updatedUploadedResponse = await this.updateUploadedCategoryImageToFS({
      file: file,
      categoryID: categoryID,
      categoryCode: categoryCode,
      fullPath: finalImageData?.fullPath,
      name: finalImageData?.name,
      fileFolderName: finalImageData?.fileFolderName,
      fileFolderPath: finalImageData?.fileFolderPath,
    });
  } else {
    // add new image
    updatedUploadedResponse = await this.uploadProductCategoryImageToFS({
      file: file,
      categoryID: categoryID,
      categoryCode: categoryCode,
    });
  }

  return {
    status: updatedUploadedResponse?.isSucceeded ? "success" : "error",
    message: updatedUploadedResponse?.isSucceeded
      ? `Category photo is updated succefully for category id ${categoryID} and category code ${categoryCode}. Error: ${updatedUploadedResponse?.message}`
      : `There is an error occurred. Category photo cannot be updated for category id ${categoryID} and category code ${categoryCode}. Error: ${updatedUploadedResponse?.message}`,
    data: updatedUploadedResponse?.fileData ?? null,
  };
};

module.exports.updateProductCategoryUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Category id is required.",
      data: {},
    };
  }

  const categoryID = req.body.id;
  let title = req?.body?.title ? req.body.title : "";
  let description = req?.body?.description ? req.body.description : "";
  const dateModified = new Date();

  if (
    (!req?.file || req.file === "") &&
    (!title || title === "") &&
    (!description || description === "")
  ) {
    return {
      status: "error",
      message: `Category with category id ${categoryID} not updated. Nothing new passed to update.`,
      data: {},
    };
  }

  const foundDataByIdObj = await this.getProductCategoryByIdUtil({
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
      message: `Category with category id ${categoryID} not found.`,
      data: {},
    };
  }

  let updatedPhotoObj = {
    data: foundDataByIdObj?.data?.imageData ?? null,
  };
  if (req.file) {
    const file = req.file;

    updatedPhotoObj = await this.updateCategoryImageInFSUtil({
      categoryID: categoryID,
      categoryCode: foundDataByIdObj.data.code,
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
  if (!description || description === "") {
    description = foundDataByIdObj?.data?.description
      ? foundDataByIdObj.data.description
      : "";
  }

  const newCategoryData = {
    id: categoryID,
    title: title,
    description: description,
    imageData: updatedPhotoObj.data,
    dateModified: dateModified,
  };

  const updatedCategoryDataSet = {
    $set: newCategoryData,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: CategoriesSchema,
    newDataObject: newCategoryData,
    updatedDataSet: updatedCategoryDataSet,
    schemaName: "Category",
    dataID: categoryID,
  });
};
