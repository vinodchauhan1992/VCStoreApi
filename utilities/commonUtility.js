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

module.exports.isValidAllowedFileSize = ({
  fileSizeInBytes,
  allowedSizeInMb = 2,
}) => {
  const { fileSize, unit } = this.getFileSizeInKBFromBytes(fileSizeInBytes);
  if (fileSize <= 0 || (fileSize > allowedSizeInMb && unit === "mb")) {
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
  const toObjectData = obj?.toObject?.();
  let newObj = toObjectData;
  if (!toObjectData) {
    newObj = obj;
  }
  const newObjectData = Object.keys(newObj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = newObj[key];
      return acc;
    }, {});

  const id = newObjectData?.id;

  delete newObjectData["id"];
  delete newObjectData["__v"];
  const updatedObject = {};
  Object.entries(newObjectData).map(([key, value], index) => {
    if (index === 0) {
      updatedObject["id"] = id;
    }
    updatedObject[key] = value;
  });
  return updatedObject;
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

module.exports.getStateCityCodeFromTitle = ({ title }) => {
  if (title && title !== "") {
    const splittedTitleArray = title.split(" ");
    if (splittedTitleArray.length === 1) {
      let secondChar = "";
      if (splittedTitleArray[0].length >= 3) {
        secondChar = splittedTitleArray[0].charAt(2);
      } else {
        secondChar = splittedTitleArray[0].charAt(
          splittedTitleArray[0].length - 1
        );
      }
      return `${splittedTitleArray[0].charAt(0)}${secondChar}`;
    } else {
      return `${splittedTitleArray[0].charAt(0)}${splittedTitleArray[
        splittedTitleArray.length - 1
      ].charAt(0)}`;
    }
  }
  return null;
};
