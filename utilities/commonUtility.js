var Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const BrandsUtility = require("./brandsUtility");
const ProductUtility = require("./productUtility");

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

module.exports.getProductDetailsByProductId = async ({ productId }) => {
  const foundObject = await ProductUtility.getProductDataByProductId({
    productId,
  });
  return foundObject;
};

module.exports.getBrandDetailsByBrandId = async ({ brandId }) => {
  const foundBrandObject = await BrandsUtility.getProductBrandDataByBrandId({
    brandID: brandId,
  });
  if (foundBrandObject.status === "success") {
    return foundBrandObject;
  }
  return {};
};

module.exports.sortObject = (obj) => {
  const newObj = obj?.toObject?.();
  let index = 0;
  return Object.keys(newObj)
    .sort()
    .reduce((acc, key) => {
      if (index === 0) {
        acc["id"] = newObj["id"];
        index = index + 1;
        return acc;
      }
      if (key !== "__v") {
        acc[key] = newObj[key];
        index = index + 1;
        return acc;
      }
      return acc;
    }, {});
};

module.exports.sortObjectsOfArray = (array) => {
  const newSortedObjectArray = [];
  array?.map?.((unsortedObject) => {
    const newObjectData = unsortedObject;
    let sortedObject = this.sortObject(newObjectData);
    newSortedObjectArray.push(sortedObject);
  });
  return newSortedObjectArray;
};
