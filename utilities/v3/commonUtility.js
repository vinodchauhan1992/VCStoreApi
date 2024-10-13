var Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const BrandsUtility = require("./brandsUtility");
const ProductUtility = require("./productUtility");
const validator = require("validator");
const jwt = require("jsonwebtoken");

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

module.exports.getFileDetails = ({ file, parentDocumentID, uniqueString }) => {
  const fileNameArray = file?.originalname?.split(".");
  let actualFileName = `${parentDocumentID}_${uniqueString}`;
  let extension = "";
  if (fileNameArray && fileNameArray.length > 0) {
    actualFileName = `${parentDocumentID}_${uniqueString}`;
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

module.exports.getCodeFromTitle = ({ title }) => {
  if (title && title !== "") {
    const updatedTitle = title?.toUpperCase?.();
    const splittedTitleArray = updatedTitle.split(" ");
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

module.exports.isValidEmail = ({ email }) => {
  if (email && email !== "") {
    return validator.isEmail(email) ? true : false;
  }
  return false;
};

module.exports.isValidPassword = ({ password }) => {
  if (password && password !== "") {
    // Checking length of the password
    if (password.length < 8) {
      return {
        isValid: false,
        message: "Your password is less than 8 characters.",
      };
    }

    // checking uppercase letters
    let uppercaseRegex = /[A-Z]/g;
    if (!password.match(uppercaseRegex)) {
      return {
        isValid: false,
        message: "Your password is lacking of atleast 1 uppercase character.",
      };
    }

    // checking lowercase letters
    let lowercaseRegex = /[a-z]/g;
    if (!password.match(lowercaseRegex)) {
      return {
        isValid: false,
        message: "Your password is lacking of atleast 1 lowercase character.",
      };
    }

    // checking the number
    let numbersRegex = /[0-9]/g;
    if (!password.match(numbersRegex)) {
      return {
        isValid: false,
        message: "Your password is lacking of atleast 1 number.",
      };
    }

    // checking the special character
    const specialCharRegex = /[!@#$%^&*()\-+.]/g;
    if (!password.match(specialCharRegex)) {
      return {
        isValid: false,
        message: "Your password is lacking of atleast 1 special character.",
      };
    }

    return {
      isValid: true,
      message: "",
    };
  }
  return {
    isValid: false,
    message: "Password is invalid.",
  };
};

module.exports.isValidOnlyCharacters = ({ text }) => {
  const validationRegex = /^[A-Za-z ]+$/;
  if (text && text !== "") {
    return validationRegex.test(text) ? true : false;
  }
  return false;
};

module.exports.isValidDate = ({ date }) => {
  if (
    date &&
    date !== "" &&
    new Date(date) !== "Invalid Date" &&
    !isNaN(new Date(date))
  ) {
    return true;
  }
  return false;
};

module.exports.generateJwtToken = ({ uniqueID, uniqueCode }) => {
  let jwtToken = jwt.sign({ user: uniqueCode }, "secret_key");
  if (uniqueID && uniqueID !== "") {
    jwtToken = `${jwtToken}${uniqueID}`;
  }
  if (uniqueCode && uniqueCode !== "") {
    jwtToken = `${jwtToken}${uniqueCode}`;
  }
  jwtToken = `${jwtToken}${uniqueCode}${new Date().valueOf()}`;
  return jwtToken;
};

module.exports.amountRoundingFunc = ({ value, isAddFraction = true }) => {
  let newValue = 0;
  if (value !== undefined && value !== null && !isNaN(Number(value))) {
    newValue = value;
  }
  if (isAddFraction) {
    newValue = newValue + 0.01;
  }
  return parseFloat(Math.round(newValue * 100) / 100).toFixed(2);
};

// Function to calculate tax using old tax slab rates
module.exports.getTaxByOldTaxRegime = ({ annualCtc }) => {
  // Lies under tax rebate limit
  if (annualCtc <= 500000) {
    return 0;
  }
  if (annualCtc <= 1000000) {
    return (annualCtc - 500000) * 0.2 + 250000 * 0.05;
  }
  return (annualCtc - 1000000) * 0.3 + 500000 * 0.2 + 250000 * 0.05;
};

// Function to calculate tax using new tax slab rates
module.exports.getTaxByNewTaxRegime = ({ annualCtc }) => {
  // lies under tax rebate limit
  if (annualCtc <= 700000) {
    return 0;
  }
  if (annualCtc <= 750000) {
    return 250000 * 0.05 + (annualCtc - 500000) * 0.1;
  }
  if (annualCtc <= 1000000) {
    return 250000 * 0.05 + 250000 * 0.1 + (annualCtc - 750000) * 0.15;
  }
  if (annualCtc <= 1250000) {
    return (
      250000 * 0.05 + 250000 * 0.1 + 250000 * 0.15 + (annualCtc - 1000000) * 0.2
    );
  }
  if (annualCtc <= 1500000) {
    return (
      250000 * 0.05 +
      250000 * 0.1 +
      250000 * 0.15 +
      250000 * 0.2 +
      (annualCtc - 1250000) * 0.25
    );
  }
  return (
    250000 * 0.05 +
    250000 * 0.1 +
    250000 * 0.15 +
    250000 * 0.2 +
    250000 * 0.25 +
    (annualCtc - 1500000) * 0.3
  );
};
