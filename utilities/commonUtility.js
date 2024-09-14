var Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");

module.exports.getTimestamp = () => {
  const timestamp = new Date().getTime();
  return timestamp;
};

module.exports.getTrimmedText = (text) => {
  const noSpecialChars = text?.replace(/[^a-zA-Z0-9 ]/g, "");
  return noSpecialChars?.replace(/\s/g, "");
};

module.exports.getLowercaseText = (text) => {
  return text?.toLowerCase();
};

module.exports.getUniqueID = () => {
  return `${uuidv4()}`;
};

module.exports.getFileDetails = (file) => {
  const fileNameArray = file?.originalname?.split(".");
  let actualFileName = this.getUniqueID();
  let extension = "";
  if (fileNameArray && fileNameArray.length > 0) {
    actualFileName = this.getUniqueID();
    if (fileNameArray.length > 1) {
      extension = fileNameArray[fileNameArray.length - 1];
    }
  }

  return {
    actualFileName,
    originalFileName: file?.originalname,
    fileNameWithExtension: `${actualFileName}.${extension}`,
    fileExtension: extension,
  };
};

module.exports.isValidWithSpecialCharactersNotAllowed = (text) => {
  if (text && text !== "") {
    let regex = /^[A-Za-z0-9]+$/;
    return regex.test(text) ? true : false;
  } else {
    return false;
  }
};

module.exports.getFileSizeInKBFromBytes = (fileSizeInBytes) => {
  let fileSize = fileSizeInBytes;
  let unit = "bytes";
  if (fileSizeInBytes >= 1024 && fileSizeInBytes) {
    fileSize = fileSizeInBytes / 1024;
    unit = "kb";
  }
  if (fileSize >= 1024) {
    fileSize = fileSize / 1024;
    unit = "mb";
  }
  return { fileSize: fileSize, unit: unit };
};

module.exports.isValidAllowedFileSize = (fileSizeInBytes) => {
  const { fileSize, unit } = this.getFileSizeInKBFromBytes(fileSizeInBytes);
  if (fileSize <= 0 || (fileSize > 2 && unit === "mb")) {
    return false;
  }
  return true;
};
