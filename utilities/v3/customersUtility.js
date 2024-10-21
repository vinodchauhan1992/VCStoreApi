const CustomersSchema = require("../../model/v3/customers");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");
const CustomersValidationsUtility = require("./customersValidationsUtility");
const {
  uploadFileToFirebaseStorage,
  deleteUploadedFileInFirebaseStorage,
  updateUploadedFileInFirebaseStorage,
} = require("./fileManagerUtility");

const imageBasePath = `images/customers`;

module.exports.uploadCustomerImageToFS = async ({
  file,
  customerID,
  username,
}) => {
  return await uploadFileToFirebaseStorage({
    file: file,
    parentDocumentID: customerID,
    parentDocumentName: username,
    imageBasePath: imageBasePath,
  });
};

module.exports.getAllCustomersUtil = async ({ req }) => {
  const allCustomersObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: CustomersSchema,
    schemaName: "Customers",
  });
  if (allCustomersObj?.status === "error") {
    return allCustomersObj;
  }
  const fullCustomerDetailsDataArr =
    await CustomersValidationsUtility.getAllCustomersWithAllDetails({
      allCustomers: allCustomersObj?.data ?? [],
    });
  return {
    ...allCustomersObj,
    data: fullCustomerDetailsDataArr,
  };
};

module.exports.getCustomerByIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Customer id is required.",
      data: {},
    };
  }

  const customerID = req.body.id;
  const customerObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CustomersSchema,
    schemaName: "Customer",
    dataID: customerID,
  });

  if (customerObj?.status === "error") {
    return customerObj;
  }
  const fullCustomerDetailsDataObj =
    await CustomersValidationsUtility.getSingleCustomerWithAllDetails({
      customerData: customerObj?.data ?? [],
    });
  return {
    ...customerObj,
    data: fullCustomerDetailsDataObj,
  };
};

module.exports.getCustomerByCustomerCodeUtil = async ({ req }) => {
  if (!req?.body?.customerCode || req.body.customerCode === "") {
    return {
      status: "error",
      message: "Customer code is required.",
      data: {},
    };
  }

  const customerCode = req.body.customerCode;
  const customerObj = await CommonApisUtility.getDataByCodeFromSchemaUtil({
    schema: CustomersSchema,
    schemaName: "Customer",
    dataCode: customerCode,
    keyname: "customerCode",
  });

  if (customerObj?.status === "error") {
    return customerObj;
  }
  const fullCustomerDetailsDataObj =
    await CustomersValidationsUtility.getSingleCustomerWithAllDetails({
      customerData: customerObj?.data ?? [],
    });
  return {
    ...customerObj,
    data: fullCustomerDetailsDataObj,
  };
};

module.exports.getCustomerByUsernameUtil = async ({ req }) => {
  if (!req?.body?.username || req.body.username === "") {
    return {
      status: "error",
      message: "Username is required.",
      data: {},
    };
  }

  const username = req.body.username;
  const customerObj = await CommonApisUtility.getDataByUsernameFromSchemaUtil({
    schema: CustomersSchema,
    schemaName: "Customer",
    username: username,
  });

  if (customerObj?.status === "error") {
    return customerObj;
  }
  const fullCustomerDetailsDataObj =
    await CustomersValidationsUtility.getSingleCustomerWithAllDetails({
      customerData: customerObj?.data ?? [],
    });
  return {
    ...customerObj,
    data: fullCustomerDetailsDataObj,
  };
};

module.exports.getCustomerByEmailUtil = async ({ req }) => {
  if (!req?.body?.email || req.body.email === "") {
    return {
      status: "error",
      message: "Email is required.",
      data: {},
    };
  }

  const email = req.body.email;
  const customerObj = await CommonApisUtility.getDataByEmailFromSchemaUtil({
    schema: CustomersSchema,
    schemaName: "Customer",
    emailID: email,
  });

  if (customerObj?.status === "error") {
    return customerObj;
  }
  const fullCustomerDetailsDataObj =
    await CustomersValidationsUtility.getSingleCustomerWithAllDetails({
      customerData: customerObj?.data ?? [],
    });
  return {
    ...customerObj,
    data: fullCustomerDetailsDataObj,
  };
};

module.exports.getCustomerByPhoneUtil = async ({ req }) => {
  if (!req?.body?.phone || req.body.phone === "") {
    return {
      status: "error",
      message: "Phone is required.",
      data: {},
    };
  }

  const phone = req.body.phone;
  const customerObj = await CommonApisUtility.getDataByPhoneFromSchemaUtil({
    schema: CustomersSchema,
    schemaName: "Customer",
    phone: phone,
  });

  if (customerObj?.status === "error") {
    return customerObj;
  }
  const fullCustomerDetailsDataObj =
    await CustomersValidationsUtility.getSingleCustomerWithAllDetails({
      customerData: customerObj?.data ?? [],
    });
  return {
    ...customerObj,
    data: fullCustomerDetailsDataObj,
  };
};

module.exports.getNewCustomerNumberUtil = async ({ req }) => {
  const allCustomersObj = await this.getAllCustomersUtil({ req });
  const dataArr = allCustomersObj?.data ?? [];

  let currentMaxCustomerNumber = 0;

  if (dataArr && dataArr.length > 0) {
    const custNumbersArr = [];
    dataArr.map((custData) => {
      custNumbersArr.push(custData.customerNumber);
    });
    const maxCustomerNumber = custNumbersArr.reduce(function (prev, current) {
      return prev && prev > current ? prev : current;
    });
    if (maxCustomerNumber) {
      currentMaxCustomerNumber = maxCustomerNumber ?? 0;
    }
  }
  const newCustomerNumber = currentMaxCustomerNumber + 1;
  return newCustomerNumber;
};

module.exports.addCustomerDataUtil = async ({ newCustomerSchema }) => {
  const newlyAddedDataObj = await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newCustomerSchema,
    schemaName: "Customer",
  });
  if (newlyAddedDataObj?.status === "error") {
    return newlyAddedDataObj;
  }

  const fullDetailsData =
    await CustomersValidationsUtility.getSingleCustomerWithAllDetails({
      customerData: newlyAddedDataObj?.data,
    });
  return {
    ...newlyAddedDataObj,
    data: fullDetailsData,
  };
};

module.exports.addNewCustomerUtil = async ({ req }) => {
  const validationObj =
    await CustomersValidationsUtility.validateAddNewCustomerUtil({ req });
  if (validationObj?.status === "error") {
    return validationObj;
  }

  const newCustomerNumber = await this.getNewCustomerNumberUtil({ req });

  const customerID = CommonUtility.getUniqueID();
  const paddedNewCustomerNumber = String(newCustomerNumber).padStart(5, "0");
  const customerCode = `Cust${paddedNewCustomerNumber}`;

  let uploadResponse = null;
  let uploadedFileStatus = "no file added";
  let uploadedFileMessage = "";
  let uploadedFileData = {};
  if (req.file) {
    uploadResponse = await this.uploadCustomerImageToFS({
      file: req.file,
      customerID: customerID,
      username: req.body.username,
    });

    uploadedFileStatus = uploadResponse?.isSucceeded ? "success" : "error";
    uploadedFileMessage = uploadResponse?.message;
    uploadedFileData = uploadResponse?.fileData;
  }

  const newCustomerSchema =
    await CustomersValidationsUtility.getNewCustomerDataFilledSchema({
      req: req,
      customerID: customerID,
      customerCode: customerCode,
      customerNumber: newCustomerNumber,
      uploadedFileData: uploadedFileData,
    });

  if (req.file) {
    if (uploadResponse.isSucceeded) {
      return await this.addCustomerDataUtil({
        newCustomerSchema: newCustomerSchema,
      });
    }
    return {
      status: uploadedFileStatus,
      message: uploadedFileMessage,
      data: uploadedFileData,
    };
  }
  return await this.addCustomerDataUtil({
    newCustomerSchema: newCustomerSchema,
  });
};

module.exports.registerNewCustomerUtil = async ({ req }) => {
  const updatedReq = {
    ...req,
    body: {
      ...req?.body,
      isActive: true,
    },
  };
  return await this.addNewCustomerUtil({ req: updatedReq });
};

module.exports.deleteUploadedCustomerImageToFS = async ({ fileUrl }) => {
  return await deleteUploadedFileInFirebaseStorage({
    fileUrl: fileUrl,
  });
};

module.exports.deleteCustomerUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }

  const customerID = req.body.id;

  const foundDataByIdObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CustomersSchema,
    schemaName: "Customer",
    dataID: customerID,
  });
  if (foundDataByIdObj?.status === "error") {
    return foundDataByIdObj;
  }

  const imageUrl = foundDataByIdObj?.data?.imageData?.imageUrl ?? null;

  let imageDeletionResponseObj = {
    status: "success",
    message: "",
    data: {},
  };
  if (imageUrl && imageUrl !== "") {
    const deleteFileResp = await this.deleteUploadedCustomerImageToFS({
      fileUrl: imageUrl,
    });
    let msg = `Customer image for customer id ${customerID} is deleted successfully.`;
    if (!deleteFileResp.isSucceeded) {
      msg = `Customer image for customer id ${customerID} is not deleted. FileDeletionError: ${deleteFileResp?.message}`;
    }
    imageDeletionResponseObj = {
      status: "success",
      message: msg,
      data: {},
    };
  }

  const deleteApiResponseObj =
    await CommonApisUtility.deleteDataByIdFromSchemaUtil({
      schema: CustomersSchema,
      schemaName: "Customer",
      dataID: customerID,
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

module.exports.updateUploadedCustomerImageToFS = async ({
  file,
  customerID,
  username,
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
    parentDocumentID: customerID,
    parentDocumentName: username,
  });
};

module.exports.updateCustomerImageInFSUtil = async ({
  customerID,
  username,
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
    updatedUploadedResponse = await this.updateUploadedCustomerImageToFS({
      file: file,
      customerID: customerID,
      username: username,
      fullPath: finalImageData?.fullPath,
      name: finalImageData?.name,
      fileFolderName: finalImageData?.fileFolderName,
      fileFolderPath: finalImageData?.fileFolderPath,
    });
  } else {
    // add new image
    updatedUploadedResponse = await this.uploadCustomerImageToFS({
      file: file,
      customerID: customerID,
      username: username,
    });
  }

  return {
    status: updatedUploadedResponse?.isSucceeded ? "success" : "error",
    message: updatedUploadedResponse?.isSucceeded
      ? `Customer photo is updated succefully for customer id ${customerID} and username ${username}. Error: ${updatedUploadedResponse?.message}`
      : `There is an error occurred. Customer photo cannot be updated for customer id ${customerID} and username ${username}. Error: ${updatedUploadedResponse?.message}`,
    data: updatedUploadedResponse?.fileData ?? null,
  };
};

module.exports.updateDataInCustomerTableUtil = async ({
  newDataObject,
  updatedDataSet,
  customerID,
}) => {
  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: CustomersSchema,
    newDataObject: newDataObject,
    updatedDataSet: updatedDataSet,
    schemaName: "Customer",
    dataID: customerID,
  });
};

module.exports.getCustomerDataByIdFromTableUtil = async ({ customerID }) => {
  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CustomersSchema,
    schemaName: "Customer",
    dataID: customerID,
  });
};

module.exports.updateCustomerPhotoUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }
  if (!req?.file) {
    return {
      status: "error",
      message: "Image is required.",
      data: {},
    };
  }

  const customerID = req.body.id;
  const foundDataByIdObj = await this.getCustomerDataByIdFromTableUtil({
    customerID: customerID,
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
      message: "Customer not found.",
      data: {},
    };
  }
  const username = foundDataByIdObj.data.username;
  const imageData = foundDataByIdObj?.data?.imageData ?? null;
  const file = req.file;

  const updatedPhotoObj = await this.updateCustomerImageInFSUtil({
    customerID: customerID,
    username: username,
    imageData: imageData,
    file: file,
  });

  if (updatedPhotoObj?.status === "error") {
    return updatedPhotoObj;
  }

  const newCustomerPhoto = {
    id: customerID,
    imageData: updatedPhotoObj.data,
    dateModified: new Date(),
  };

  const updatedCustomerPhotoSet = {
    $set: newCustomerPhoto,
  };

  return await this.updateDataInCustomerTableUtil({
    newDataObject: newCustomerPhoto,
    updatedDataSet: updatedCustomerPhotoSet,
    customerID: customerID,
  });
};

module.exports.updateCustomerNameUtil = async ({ req }) => {
  const validateCustomerNameObj =
    await CustomersValidationsUtility.validateAddNewCustomerNameUtil({ req });
  if (validateCustomerNameObj?.status === "error") {
    return validateCustomerNameObj;
  }
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }

  const customerID = req.body.id;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;

  const foundCustomerByIdObj = await this.getCustomerDataByIdFromTableUtil({
    customerID: customerID,
  });
  if (foundCustomerByIdObj?.status === "error") {
    return foundCustomerByIdObj;
  }

  const newCustomerNames = {
    id: customerID,
    name: {
      firstname: firstname,
      lastname: lastname,
    },
    dateModified: new Date(),
  };

  const updatedCustomerNamesSet = {
    $set: newCustomerNames,
  };

  return await this.updateDataInCustomerTableUtil({
    newDataObject: newCustomerNames,
    updatedDataSet: updatedCustomerNamesSet,
    customerID: customerID,
  });
};

module.exports.updateCustomerAddressUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }

  const customerID = req.body.id;
  const foundCustomerByIdObj = await this.getCustomerDataByIdFromTableUtil({
    customerID: customerID,
  });
  if (foundCustomerByIdObj?.status === "error") {
    return foundCustomerByIdObj;
  }

  const validateUpdateCustomerAddressObj =
    await CustomersValidationsUtility.validateUpdateCustomerAddressUtil({
      req,
    });
  if (validateUpdateCustomerAddressObj?.status === "error") {
    return validateUpdateCustomerAddressObj;
  }

  const newCustomerAddress = {
    id: customerID,
    address: {
      address: req.body.address,
      street: req.body.street,
      landmark: req.body.landmark,
      countryID: req.body.countryID,
      cityID: req.body.cityID,
      stateID: req.body.stateID,
      pincode: req.body.pincode,
    },
    dateModified: new Date(),
  };

  const updatedCustomerAddressSet = {
    $set: newCustomerAddress,
  };

  return await this.updateDataInCustomerTableUtil({
    newDataObject: newCustomerAddress,
    updatedDataSet: updatedCustomerAddressSet,
    customerID: customerID,
  });
};

module.exports.updateCustomerPhoneUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }
  if (!req?.body?.phone || req.body.phone === "") {
    return {
      status: "error",
      message: `Phone number is required.`,
      data: {},
    };
  }

  const customerID = req.body.id;
  const phone = req.body.phone;

  const foundCustomerByIdObj = await this.getCustomerDataByIdFromTableUtil({
    customerID: customerID,
  });
  if (foundCustomerByIdObj?.status === "error") {
    return foundCustomerByIdObj;
  }

  const foundCustomerByPhoneObj =
    await CommonApisUtility.getDataByPhoneFromSchemaUtil({
      schema: CustomersSchema,
      schemaName: "Customer",
      phone: phone,
    });
  if (
    foundCustomerByPhoneObj?.status === "success" &&
    foundCustomerByPhoneObj?.data?.id !== customerID
  ) {
    return {
      status: "error",
      message: `Another customer is already registered with same phone number ${phone}. Please choose a different phone number.`,
      data: {},
    };
  }

  const newCustomerPhone = {
    id: customerID,
    phone: phone,
    dateModified: new Date(),
  };

  const updatedCustomerPhoneSet = {
    $set: newCustomerPhone,
  };

  return await this.updateDataInCustomerTableUtil({
    newDataObject: newCustomerPhone,
    updatedDataSet: updatedCustomerPhoneSet,
    customerID: customerID,
  });
};

module.exports.updateCustomerGenderUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }
  if (!req?.body?.genderID || req.body.genderID === "") {
    return {
      status: "error",
      message: `Gender is required.`,
      data: {},
    };
  }

  const customerID = req.body.id;
  const genderID = req.body.genderID;

  const foundCustomerByIdObj = await this.getCustomerDataByIdFromTableUtil({
    customerID: customerID,
  });
  if (foundCustomerByIdObj?.status === "error") {
    return foundCustomerByIdObj;
  }

  const foundGenderByIdObj =
    await CustomersValidationsUtility.apiValidationForGenderUtil({ req: req });
  if (foundGenderByIdObj?.status === "error") {
    return foundGenderByIdObj;
  }

  const newCustomerGender = {
    id: customerID,
    genderID: genderID,
    dateModified: new Date(),
  };

  const updatedCustomerGenderSet = {
    $set: newCustomerGender,
  };

  return await this.updateDataInCustomerTableUtil({
    newDataObject: newCustomerGender,
    updatedDataSet: updatedCustomerGenderSet,
    customerID: customerID,
  });
};

module.exports.updateCustomerStatusUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }
  if (!CommonUtility.validBooleanValue({ value: req?.body?.isActive })) {
    return {
      status: "error",
      message: `Is active must be true/false.`,
      data: {},
    };
  }

  const customerID = req.body.id;

  const foundCustomerByIdObj = await this.getCustomerDataByIdFromTableUtil({
    customerID: customerID,
  });
  if (foundCustomerByIdObj?.status === "error") {
    return foundCustomerByIdObj;
  }

  const newCustomerStatus = {
    id: customerID,
    isActive: req?.body?.isActive ?? false,
    dateModified: new Date(),
  };

  const updatedCustomerStatusSet = {
    $set: newCustomerStatus,
  };

  return await this.updateDataInCustomerTableUtil({
    newDataObject: newCustomerStatus,
    updatedDataSet: updatedCustomerStatusSet,
    customerID: customerID,
  });
};

module.exports.updateCustomerDobUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }
  if (!req?.body?.dateOfBirth || req.body.dateOfBirth === "") {
    return {
      status: "error",
      message: "Customer date of birth is required.",
      data: {},
    };
  }
  if (!CommonUtility.isValidDate({ date: req.body.dateOfBirth })) {
    return {
      status: "error",
      message: "Customer date of birth is invalid.",
      data: {},
    };
  }

  const customerID = req.body.id;
  const dateOfBirth = req.body.dateOfBirth;

  const foundCustomerByIdObj = await this.getCustomerDataByIdFromTableUtil({
    customerID: customerID,
  });
  if (foundCustomerByIdObj?.status === "error") {
    return foundCustomerByIdObj;
  }

  const newCustomerDob = {
    id: customerID,
    dateOfBirth: new Date(dateOfBirth),
    dateModified: new Date(),
  };

  const updatedCustomerDobSet = {
    $set: newCustomerDob,
  };

  return await this.updateDataInCustomerTableUtil({
    newDataObject: newCustomerDob,
    updatedDataSet: updatedCustomerDobSet,
    customerID: customerID,
  });
};

module.exports.updateCustomerMonthlyIncomeUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }
  if (!req?.body?.monthlyIncome || req.body.monthlyIncome === "") {
    return {
      status: "error",
      message: `Monthly income is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.monthlyIncome)) {
    return {
      status: "error",
      message: `Monthly income must be number value.`,
      data: {},
    };
  }

  const customerID = req.body.id;
  const monthlyIncome = Number(req.body.monthlyIncome);
  const annualIncome = monthlyIncome * 12;

  const foundCustomerByIdObj = await this.getCustomerDataByIdFromTableUtil({
    customerID: customerID,
  });
  if (foundCustomerByIdObj?.status === "error") {
    return foundCustomerByIdObj;
  }

  const newCustomerDob = {
    id: customerID,
    incomeDetails: {
      monthlyIncome: monthlyIncome,
      annualIncome: annualIncome,
    },
    dateModified: new Date(),
  };

  const updatedCustomerDobSet = {
    $set: newCustomerDob,
  };

  return await this.updateDataInCustomerTableUtil({
    newDataObject: newCustomerDob,
    updatedDataSet: updatedCustomerDobSet,
    customerID: customerID,
  });
};
