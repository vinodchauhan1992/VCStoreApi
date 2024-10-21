var Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const BrandsUtility = require("./brandsUtility");
const ProductUtility = require("./productUtility");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const CommonApisUtility = require("./commonApisUtility");
const ConstantsUtility = require("./constantsUtility");
const EmployeesLoginSchema = require("../../model/v3/employeesLogin");
const AppIdsUtility = require("./appIdsUtility");
const CountriesSchema = require("../../model/v3/countries");
const StatesSchema = require("../../model/v3/states");
const CitiesSchema = require("../../model/v3/cities");
const GendersSchema = require("../../model/v3/genders");

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

module.exports.validCharactersForUsername = ({ text }) => {
  const validationRegex = /^[a-z0-9_\.]+$/;
  if (text && text !== "") {
    return validationRegex.test(text) ? true : false;
  }
  return false;
};

module.exports.validBooleanValue = ({ value }) => {
  if (typeof value === "boolean") {
    return true;
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

module.exports.amountRoundingFunc = ({ value, isAddFraction = false }) => {
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

module.exports.authValidationChecksForApiCalls = async ({ req, data }) => {
  if (!req?.headers?.jwttoken || req.headers.jwttoken === "") {
    return {
      status: "error",
      message: `You are not authorised to call this api. Jwt token is missing.`,
      data: data,
    };
  }
  if (!req?.headers?.app_id || req.body.app_id === "") {
    return {
      status: "error",
      message: "You are not authorised to call this api. App id is missing.",
      data: data,
    };
  }
  const appID = req.headers.app_id;
  const jwttoken = req.headers.jwttoken;

  const foundEmpLogin = await CommonApisUtility.getDataByJwtTokenFromSchemaUtil(
    {
      schema: EmployeesLoginSchema,
      schemaName: "Employee Login",
      jwtToken: jwttoken,
    }
  );
  if (foundEmpLogin?.status === "error") {
    return {
      status: "error",
      message: `You are not authorised to call this api. Employee login details not found.`,
      data: {},
    };
  }
  if (foundEmpLogin?.status === "success" && foundEmpLogin?.data?.isLogout) {
    return {
      status: "error",
      message: `You are not authorised to call this api. You are not logged in.`,
      data: {},
    };
  }
  if (
    foundEmpLogin?.status === "success" &&
    foundEmpLogin?.data?.departmentID ===
      ConstantsUtility.utils.ADMIN_DEPARTMENT_ID
  ) {
    return {
      status: "error",
      message: `You are not authorised to call this api. You are not from administrations department.`,
      data: {},
    };
  }

  const foundAppIdObj = await AppIdsUtility.getAppIdByAppIdUtil({
    req: { body: { id: appID } },
  });

  if (foundAppIdObj?.status === "error") {
    return {
      status: "error",
      message: `You are not authorised to call this api. App id not found in database.`,
      data: {},
    };
  }

  if (
    foundAppIdObj?.status === "success" &&
    foundAppIdObj?.data?.title !== ConstantsUtility.utils.APP_TYPE_ADMIN
  ) {
    return {
      status: "error",
      message: `You are not authorised to call this api. App id is incorrect.`,
      data: {},
    };
  }

  return {
    status: "success",
    message: `All good.`,
    data: data,
  };
};

module.exports.capitalizeLetterOfEachWord = ({ str }) => {
  // Split the input string into an array of words
  str = str.split(" ");

  // Iterate through each word in the array
  for (var i = 0, x = str.length; i < x; i++) {
    // Capitalize the first letter of each word and concatenate it with the rest of the word
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }

  // Join the modified array of words back into a string
  return str.join(" ");
};

module.exports.getCountryDetailsByCountryId = async ({ countryID }) => {
  const foundCountryObject = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CountriesSchema,
    schemaName: "Country",
    dataID: countryID,
  });
  if (
    foundCountryObject.status === "success" &&
    Object.keys(foundCountryObject?.data).length > 0
  ) {
    return foundCountryObject;
  }
  return {
    status: foundCountryObject?.status,
    message: foundCountryObject?.message,
    data: {
      countryID: countryID,
    },
  };
};

module.exports.getStateDetailsByStateId = async ({ stateID }) => {
  const foundStateObject = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: StatesSchema,
    schemaName: "State",
    dataID: stateID,
  });
  if (
    foundStateObject.status === "success" &&
    Object.keys(foundStateObject?.data).length > 0
  ) {
    return foundStateObject;
  }
  return {
    status: foundStateObject?.status,
    message: foundStateObject?.message,
    data: {
      stateID: stateID,
    },
  };
};

module.exports.getCityDetailsByCityId = async ({ cityID }) => {
  const foundCityObject = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CitiesSchema,
    schemaName: "City",
    dataID: cityID,
  });
  if (
    foundCityObject.status === "success" &&
    Object.keys(foundCityObject?.data).length > 0
  ) {
    return foundCityObject;
  }
  return {
    status: foundCityObject?.status,
    message: foundCityObject?.message,
    data: {
      cityID: cityID,
    },
  };
};

module.exports.getGenderRelatedDetailsByGenderId = async ({ genderID }) => {
  const foundGenderObject = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: GendersSchema,
    schemaName: "Gender",
    dataID: genderID,
  });
  if (
    foundGenderObject?.status === "success" &&
    Object.keys(foundGenderObject?.data).length > 0
  ) {
    return foundGenderObject;
  }
  return {
    ...foundGenderObject,
    data: {
      genderID: genderID && genderID !== "" ? genderID : "",
    },
  };
};
