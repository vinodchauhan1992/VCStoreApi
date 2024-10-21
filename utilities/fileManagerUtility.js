const {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} = require("firebase/storage");
const storage = require("../firebase/firebaseSettings");
const CommonUtility = require("./commonUtility");

module.exports.uploadFileToFirebaseStorage = async ({
  file,
  parentDocumentID,
  parentDocumentName,
  imageBasePath,
}) => {
  if (!file) {
    return {
      isSucceeded: false,
      message: "File is required.",
      fileData: {},
    };
  }
  if (!file?.size) {
    return {
      isSucceeded: false,
      message: "File is invalid as it doesn't contain size of the file.",
      fileData: {},
    };
  }
  if (file.size < 1) {
    return {
      isSucceeded: false,
      message: "File is invalid as file size is 0 bytes.",
      fileData: {},
    };
  }
  if (!CommonUtility.isValidAllowedFileSize({ fileSizeInBytes: file.size })) {
    const { fileSize, unit } = CommonUtility.getFileSizeInKBFromBytes(
      file.size
    );
    return {
      isSucceeded: false,
      message: `File size cannot be more than 2mb. Your sent file size is ${fileSize}${unit}`,
      fileData: {},
    };
  }
  if (!imageBasePath || imageBasePath === "") {
    return {
      isSucceeded: false,
      message: "Send image base path",
      fileData: {},
    };
  }
  const { fileNameWithExtension } = CommonUtility.getFileDetails(file);

  const fileFolderPath = `${imageBasePath}/${parentDocumentID}`;

  const imageRef = ref(storage, `${fileFolderPath}/${fileNameWithExtension}`);
  const metatype = {
    contentType: file.mimetype,
    name: fileNameWithExtension,
  };

  try {
    const snapshot = await uploadBytes(imageRef, file.buffer, metatype);
    const imageUrl = await getDownloadURL(imageRef);
    return {
      isSucceeded: true,
      message: `File is uploaded successfully to ${snapshot.metadata.fullPath}.`,
      fileData: {
        fullPath: snapshot.metadata.fullPath,
        name: snapshot.metadata.name,
        size: snapshot.metadata.size,
        dateCreated: snapshot.metadata.timeCreated,
        dateUpdated: snapshot.metadata.updated,
        contentType: snapshot.metadata.contentType,
        imageUrl: imageUrl,
        fileFolderName: imageBasePath,
        fileFolderPath: fileFolderPath,
        parentDocumentID: parentDocumentID,
        parentDocumentName: parentDocumentName,
      },
    };
  } catch (error) {
    return {
      isSucceeded: false,
      message: `There is an error occurred in uploading file. ${error.message}`,
      fileData: {},
    };
  }
};

module.exports.updateUploadedFileInFirebaseStorage = async ({
  file,
  fullPath,
  name,
  fileFolderName,
  fileFolderPath,
  parentDocumentID,
  parentDocumentName,
}) => {
  if (!file) {
    return {
      isSucceeded: false,
      message: "File is required.",
      fileData: {},
    };
  }
  if (!file?.size) {
    return {
      isSucceeded: false,
      message: "File is invalid as it doesn't contain size of the file.",
      fileData: {},
    };
  }
  if (file.size < 1) {
    return {
      isSucceeded: false,
      message: "File is invalid as file size is 0 bytes.",
      fileData: {},
    };
  }
  if (!CommonUtility.isValidAllowedFileSize({ fileSizeInBytes: file.size })) {
    const { fileSize, unit } = CommonUtility.getFileSizeInKBFromBytes(
      file.size
    );
    return {
      isSucceeded: false,
      message: `File size cannot be more than 2mb. Your sent file size is ${fileSize}${unit}`,
      fileData: {},
    };
  }
  if (!fullPath || fullPath === "") {
    return {
      isSucceeded: false,
      message: "Send image full path to update.",
      fileData: {},
    };
  }
  if (!name || name === "") {
    return {
      isSucceeded: false,
      message: "Send image name to update.",
      fileData: {},
    };
  }

  const imageRef = ref(storage, `${fullPath}`);
  const metatype = {
    contentType: file.mimetype,
    name: name,
  };

  try {
    const snapshot = await uploadBytes(imageRef, file.buffer, metatype);
    const imageUrl = await getDownloadURL(imageRef);
    return {
      isSucceeded: true,
      message: `File is update successfully at ${snapshot.metadata.fullPath}.`,
      fileData: {
        fullPath: snapshot.metadata.fullPath,
        name: snapshot.metadata.name,
        size: snapshot.metadata.size,
        dateCreated: snapshot.metadata.timeCreated,
        dateUpdated: snapshot.metadata.updated,
        contentType: snapshot.metadata.contentType,
        imageUrl: imageUrl,
        fileFolderName: fileFolderName,
        fileFolderPath: fileFolderPath,
        parentDocumentID: parentDocumentID,
        parentDocumentName: parentDocumentName,
      },
    };
  } catch (error) {
    return {
      isSucceeded: false,
      message: `There is an error occurred in updating file. ${error.message}`,
      fileData: {},
    };
  }
};

module.exports.deleteUploadedFileInFirebaseStorage = async ({ fileUrl }) => {
  if (!fileUrl || fileUrl === "") {
    return {
      isSucceeded: false,
      message: `File url is required.`,
      fileData: {},
    };
  }

  // Create a reference to the file to delete
  const deleteFileRef = ref(storage, fileUrl);

  try {
    await deleteObject(deleteFileRef);
    return {
      isSucceeded: true,
      message: `File deleted successfully.`,
      fileData: {},
    };
  } catch (error) {
    return {
      isSucceeded: false,
      message: `There is an error occurred in deleting file. ${error.message}`,
      fileData: {},
    };
  }
};
