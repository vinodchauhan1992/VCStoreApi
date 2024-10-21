const ClientBannersSchema = require("../../model/v3/clientBanners");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");
const {
  uploadFileToFirebaseStorage,
  deleteUploadedFileInFirebaseStorage,
  updateUploadedFileInFirebaseStorage,
} = require("./fileManagerUtility");

const imageBasePath = `images/clientBanners`;

module.exports.uploadClientBannerImageToFS = async ({
  file,
  clientBannerID,
  clientBannerCode,
}) => {
  return await uploadFileToFirebaseStorage({
    file: file,
    parentDocumentID: clientBannerID,
    parentDocumentName: clientBannerCode,
    imageBasePath: imageBasePath,
    allowedSizeInMb: 10,
  });
};

module.exports.getAllClientBannersUtil = async ({ req }) => {
  return await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: ClientBannersSchema,
    schemaName: "Client Banners",
  });
};

module.exports.getClientBannerByIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Client banner id is required.",
      data: {},
    };
  }

  const clientBannerID = req.body.id;

  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: ClientBannersSchema,
    schemaName: "Client Banner",
    dataID: clientBannerID,
  });
};

module.exports.getNewClientBannerNumberUtil = async ({ req }) => {
  const allClientBannersObj = await this.getAllClientBannersUtil({ req });
  const dataArr = allClientBannersObj?.data ?? [];

  let currentMaxClientBannerNumber = 0;

  if (dataArr && dataArr.length > 0) {
    const clientBannerNumbersArr = [];
    dataArr.map((clientBannerData) => {
      clientBannerNumbersArr.push(clientBannerData.clientBannerNumber);
    });
    const maxClientBannerNumber = clientBannerNumbersArr.reduce(function (
      prev,
      current
    ) {
      return prev && prev > current ? prev : current;
    });
    if (maxClientBannerNumber) {
      currentMaxClientBannerNumber = maxClientBannerNumber ?? 0;
    }
  }
  const newClientBannerNumber = currentMaxClientBannerNumber + 1;
  return newClientBannerNumber;
};

module.exports.addClientBannerUtil = async ({ req }) => {
  if (!req?.file) {
    return {
      status: "error",
      message: "Client banner image is required.",
      data: {},
    };
  }
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: "Client banner title is required.",
      data: {},
    };
  }
  if (!req?.body?.description || req.body.description === "") {
    return {
      status: "error",
      message: "Client banner description is required.",
      data: {},
    };
  }

  const newClientBannerNumber = await this.getNewClientBannerNumberUtil({
    req,
  });
  const paddedNewClientBannerNumber = String(newClientBannerNumber).padStart(
    5,
    "0"
  );
  const clientBannerCode = `Ban${paddedNewClientBannerNumber}`;
  const clientBannerID = CommonUtility.getUniqueID();
  const title = req.body.title;
  const description = req.body.description;
  const link = req?.body?.link ? req.body.link : "";
  const dateAdded = new Date();
  const dateModified = new Date();

  let uploadResponse = null;
  let uploadedFileStatus = "no file added";
  let uploadedFileMessage = "";
  let uploadedFileData = {};
  if (req.file) {
    uploadResponse = await this.uploadClientBannerImageToFS({
      file: req.file,
      clientBannerID: clientBannerID,
      clientBannerCode: clientBannerCode,
    });

    uploadedFileStatus = uploadResponse?.isSucceeded ? "success" : "error";
    uploadedFileMessage = uploadResponse?.message;
    uploadedFileData = uploadResponse?.fileData;
  }

  const newClientBannersSchema = new ClientBannersSchema({
    id: clientBannerID,
    clientBannerNumber: newClientBannerNumber,
    clientBannerCode: clientBannerCode,
    link: link,
    imageData: uploadedFileData,
    title: title,
    description: description,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  if (req.file) {
    if (uploadResponse.isSucceeded) {
      return await CommonApisUtility.addNewDataToSchemaUtil({
        newSchema: newClientBannersSchema,
        schemaName: "Client Banner",
      });
    }
    return {
      status: uploadedFileStatus,
      message: uploadedFileMessage,
      data: uploadedFileData,
    };
  }
  return {
    status: "error",
    message: "Client banner image is not uploaded.",
    data: {},
  };
};

module.exports.updateUploadedClientBannerImageToFS = async ({
  file,
  clientBannerID,
  clientBannerCode,
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
    parentDocumentID: clientBannerID,
    parentDocumentName: clientBannerCode,
    allowedSizeInMb: 10,
  });
};

module.exports.updateClientBannerImageInFSUtil = async ({
  clientBannerID,
  clientBannerCode,
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
    updatedUploadedResponse = await this.updateUploadedClientBannerImageToFS({
      file: file,
      clientBannerID: clientBannerID,
      clientBannerCode: clientBannerCode,
      fullPath: finalImageData?.fullPath,
      name: finalImageData?.name,
      fileFolderName: finalImageData?.fileFolderName,
      fileFolderPath: finalImageData?.fileFolderPath,
    });
  } else {
    // add new image
    updatedUploadedResponse = await this.uploadClientBannerImageToFS({
      file: file,
      clientBannerID: clientBannerID,
      clientBannerCode: clientBannerCode,
    });
  }

  return {
    status: updatedUploadedResponse?.isSucceeded ? "success" : "error",
    message: updatedUploadedResponse?.isSucceeded
      ? `Client banner photo is updated succefully for client banner id ${clientBannerID} and client banner code ${clientBannerCode}. Error: ${updatedUploadedResponse?.message}`
      : `There is an error occurred. Client banner photo cannot be updated for client banner id ${clientBannerID} and client banner code ${clientBannerCode}. Error: ${updatedUploadedResponse?.message}`,
    data: updatedUploadedResponse?.fileData ?? null,
  };
};

module.exports.updateClientBannerUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Client banner id is required.",
      data: {},
    };
  }
  if (!req?.file) {
    return {
      status: "error",
      message: "Client banner image is required.",
      data: {},
    };
  }

  const file = req.file;
  const clientBannerID = req.body.id;
  let title = req?.body?.title ? req.body.title : "";
  let description = req?.body?.description ? req.body.description : "";
  let link = req?.body?.link ? req.body.link : "";
  const dateModified = new Date();

  const foundDataByIdObj = await this.getClientBannerByIDUtil({
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
      message: "Client banner not found.",
      data: {},
    };
  }

  const updatedPhotoObj = await this.updateClientBannerImageInFSUtil({
    clientBannerID: clientBannerID,
    clientBannerCode: foundDataByIdObj.data.clientBannerCode,
    imageData: foundDataByIdObj.data.imageData,
    file: file,
  });

  if (updatedPhotoObj?.status === "error") {
    return updatedPhotoObj;
  }

  if (!title || title === "") {
    title = foundDataByIdObj?.data?.title ? foundDataByIdObj.data.title : "";
  }
  if (!description || description === "") {
    description = foundDataByIdObj?.data?.description
      ? foundDataByIdObj.data.description
      : "";
  }
  if (!link || link === "") {
    link = foundDataByIdObj?.data?.link ? foundDataByIdObj.data.link : "";
  }

  const newClientBannerData = {
    id: clientBannerID,
    title: title,
    description: description,
    link: link,
    imageData: updatedPhotoObj.data,
    dateModified: dateModified,
  };

  const updatedClientBannerDataSet = {
    $set: newClientBannerData,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: ClientBannersSchema,
    newDataObject: newClientBannerData,
    updatedDataSet: updatedClientBannerDataSet,
    schemaName: "Client Banner",
    dataID: clientBannerID,
  });
};

module.exports.deleteUploadedClientBannerImageToFS = async ({ fileUrl }) => {
  return await deleteUploadedFileInFirebaseStorage({
    fileUrl: fileUrl,
  });
};

module.exports.deleteClientBannerUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Client banner id is required.",
      data: {},
    };
  }

  const clientBannerID = req.body.id;
  const foundClientBannerByIDObj = await this.getClientBannerByIDUtil({
    req: req,
  });
  if (foundClientBannerByIDObj?.status === "error") {
    return foundClientBannerByIDObj;
  }

  const imageUrl = foundClientBannerByIDObj?.data?.imageData?.imageUrl ?? null;
  let imageDeletionResponseObj = {
    status: "success",
    message: "",
    data: {},
  };
  if (imageUrl && imageUrl !== "") {
    const deleteFileResp = await this.deleteUploadedClientBannerImageToFS({
      fileUrl: imageUrl,
    });

    let msg = `Client banner image for client banner id ${clientBannerID} is deleted successfully.`;
    if (!deleteFileResp.isSucceeded) {
      msg = `Client banner image for client banner id ${clientBannerID} is not deleted. FileDeletionError: ${deleteFileResp?.message}`;
    }
    imageDeletionResponseObj = {
      status: "success",
      message: msg,
      data: {},
    };
  }

  const deleteApiResponseObj =
    await CommonApisUtility.deleteDataByIdFromSchemaUtil({
      schema: ClientBannersSchema,
      schemaName: "Client Banner",
      dataID: clientBannerID,
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
