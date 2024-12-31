const EmployeesSchema = require("../../model/v3/employees");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");
const EmployeesValidationsUtility = require("./employeesValidationsUtility");
const {
  uploadFileToFirebaseStorage,
  deleteUploadedFileInFirebaseStorage,
  updateUploadedFileInFirebaseStorage,
} = require("./fileManagerUtility");
const EmployeesLoginUtility = require("./employeesLoginUtility");

const imageBasePath = `images/employees`;

module.exports.uploadEmployeeImageToFS = async ({
  file,
  employeeID,
  employeeCode,
}) => {
  return await uploadFileToFirebaseStorage({
    file: file,
    parentDocumentID: employeeID,
    parentDocumentName: employeeCode,
    imageBasePath: imageBasePath,
    allowedSizeInMb: 5,
  });
};

module.exports.getAllEmployeesUtil = async ({ req }) => {
  const allEmployeesObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: EmployeesSchema,
    schemaName: "Employees",
    arrSortByKey: "employeeNumber",
  });
  if (allEmployeesObj?.status === "error") {
    return allEmployeesObj;
  }
  const fullEmployeeDetailsDataArr =
    await EmployeesValidationsUtility.getAllEmployeesWithAllDetails({
      allEmployees: allEmployeesObj?.data ?? [],
    });
  return {
    ...allEmployeesObj,
    data: fullEmployeeDetailsDataArr,
  };
};

module.exports.getEmployeeByIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Employee id is required.",
      data: {},
    };
  }

  const employeeID = req.body.id;
  const employeeObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: EmployeesSchema,
    schemaName: "Employee",
    dataID: employeeID,
  });

  if (employeeObj?.status === "error") {
    return employeeObj;
  }
  const fullEmployeeDetailsDataObj =
    await EmployeesValidationsUtility.getSingleEmployeeWithAllDetails({
      employeeData: employeeObj?.data ?? [],
    });
  return {
    ...employeeObj,
    data: fullEmployeeDetailsDataObj,
  };
};

module.exports.getEmployeeByEmployeeCodeUtil = async ({ req }) => {
  if (!req?.body?.employeeCode || req.body.employeeCode === "") {
    return {
      status: "error",
      message: "Employee code is required.",
      data: {},
    };
  }

  const employeeCode = req.body.employeeCode;
  const employeeObj = await CommonApisUtility.getDataByCodeFromSchemaUtil({
    schema: EmployeesSchema,
    schemaName: "Employee",
    dataCode: employeeCode,
    keyname: "employeeCode",
  });

  if (employeeObj?.status === "error") {
    return employeeObj;
  }
  const fullEmployeeDetailsDataObj =
    await EmployeesValidationsUtility.getSingleEmployeeWithAllDetails({
      employeeData: employeeObj?.data ?? [],
    });
  return {
    ...employeeObj,
    data: fullEmployeeDetailsDataObj,
  };
};

module.exports.getNewEmployeeNumberUtil = async ({ req }) => {
  const allEmployeesObj = await this.getAllEmployeesUtil({ req });
  const dataArr = allEmployeesObj?.data ?? [];

  let currentMaxEmployeeNumber = 0;

  if (dataArr && dataArr.length > 0) {
    const empNumbersArr = [];
    dataArr.map((empData) => {
      empNumbersArr.push(empData.employeeNumber);
    });
    const maxEmployeeNumber = empNumbersArr.reduce(function (prev, current) {
      return prev && prev > current ? prev : current;
    });
    if (maxEmployeeNumber) {
      currentMaxEmployeeNumber = maxEmployeeNumber ?? 0;
    }
  }
  const newEmployeeNumber = currentMaxEmployeeNumber + 1;
  return newEmployeeNumber;
};

module.exports.addEmployeeDataUtil = async ({ newEmployeeSchema }) => {
  const newlyAddedDataObj = await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newEmployeeSchema,
    schemaName: "Employee",
  });
  if (newlyAddedDataObj?.status === "error") {
    return newlyAddedDataObj;
  }

  const fullDetailsData =
    await EmployeesValidationsUtility.getSingleEmployeeWithAllDetails({
      employeeData: newlyAddedDataObj?.data,
    });
  return {
    ...newlyAddedDataObj,
    data: fullDetailsData,
  };
};

module.exports.addNewEmployeeUtil = async ({ req }) => {
  const validationObj =
    await EmployeesValidationsUtility.validateAddNewEmployeeUtil({ req });
  if (validationObj?.status === "error") {
    return validationObj;
  }

  const newEmployeeNumber = await this.getNewEmployeeNumberUtil({ req });

  const employeeID = CommonUtility.getUniqueID();
  const paddedNewEmployeeNumber = String(newEmployeeNumber).padStart(5, "0");
  const employeeCode = `Emp${paddedNewEmployeeNumber}`;

  let uploadResponse = null;
  let uploadedFileStatus = "no file added";
  let uploadedFileMessage = "";
  let uploadedFileData = {};
  if (req.file) {
    uploadResponse = await this.uploadEmployeeImageToFS({
      file: req.file,
      employeeID: employeeID,
      employeeCode: employeeCode,
    });

    uploadedFileStatus = uploadResponse?.isSucceeded ? "success" : "error";
    uploadedFileMessage = uploadResponse?.message;
    uploadedFileData = uploadResponse?.fileData;
  }

  const newEmployeeSchema =
    await EmployeesValidationsUtility.getNewEmployeeDataFilledSchema({
      req: req,
      employeeID: employeeID,
      employeeCode: employeeCode,
      employeeNumber: newEmployeeNumber,
      uploadedFileData: uploadedFileData,
    });

  if (req.file) {
    if (uploadResponse.isSucceeded) {
      return await this.addEmployeeDataUtil({ newEmployeeSchema });
    }
    return {
      status: uploadedFileStatus,
      message: uploadedFileMessage,
      data: uploadedFileData,
    };
  }
  return await this.addEmployeeDataUtil({ newEmployeeSchema });
};

module.exports.deleteUploadedEmployeeImageToFS = async ({ fileUrl }) => {
  return await deleteUploadedFileInFirebaseStorage({
    fileUrl: fileUrl,
  });
};

module.exports.deleteEmployeeUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }

  const employeeID = req.body.id;

  const foundDataByIdObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: EmployeesSchema,
    schemaName: "Employee",
    dataID: employeeID,
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
    const deleteFileResp = await this.deleteUploadedEmployeeImageToFS({
      fileUrl: imageUrl,
    });
    let msg = `Employee image for employee id ${employeeID} is deleted successfully.`;
    if (!deleteFileResp.isSucceeded) {
      msg = `Employee image for employee id ${employeeID} is not deleted. FileDeletionError: ${deleteFileResp?.message}`;
    }
    imageDeletionResponseObj = {
      status: "success",
      message: msg,
      data: {},
    };
  }

  const deleteApiResponseObj =
    await CommonApisUtility.deleteDataByIdFromSchemaUtil({
      schema: EmployeesSchema,
      schemaName: "Employee",
      dataID: employeeID,
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

module.exports.updateUploadedEmployeeImageToFS = async ({
  file,
  employeeID,
  employeeCode,
  fullPath,
  name,
  fileFolderName,
  fileFolderPath,
}) => {
  return await updateUploadedFileInFirebaseStorage({
    file,
    fullPath,
    name,
    fileFolderName,
    fileFolderPath,
    parentDocumentID: employeeID,
    parentDocumentName: employeeCode,
    allowedSizeInMb: 5,
  });
};

module.exports.updateEmployeeImageInFSUtil = async ({
  employeeID,
  employeeCode,
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
    updatedUploadedResponse = await this.updateUploadedEmployeeImageToFS({
      file: file,
      employeeID: employeeID,
      employeeCode: employeeCode,
      fullPath: finalImageData?.fullPath,
      name: finalImageData?.name,
      fileFolderName: finalImageData?.fileFolderName,
      fileFolderPath: finalImageData?.fileFolderPath,
    });
  } else {
    // add new image
    updatedUploadedResponse = await this.uploadEmployeeImageToFS({
      file: file,
      employeeID: employeeID,
      employeeCode: employeeCode,
    });
  }

  return {
    status: updatedUploadedResponse?.isSucceeded ? "success" : "error",
    message: updatedUploadedResponse?.isSucceeded
      ? `Employee photo is updated succefully for employee id ${employeeID} and employee code ${employeeCode}. Error: ${updatedUploadedResponse?.message}`
      : `There is an error occurred. Employee photo cannot be updated for employee id ${employeeID} and employee code ${employeeCode}. Error: ${updatedUploadedResponse?.message}`,
    data: updatedUploadedResponse?.fileData ?? null,
  };
};

module.exports.updateDataInEmployeeTableUtil = async ({
  newDataObject,
  updatedDataSet,
  employeeID,
}) => {
  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: EmployeesSchema,
    newDataObject: newDataObject,
    updatedDataSet: updatedDataSet,
    schemaName: "Employee",
    dataID: employeeID,
  });
};

module.exports.getEmployeeDataByIdFromTableUtil = async ({ employeeID }) => {
  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: EmployeesSchema,
    schemaName: "Employee",
    dataID: employeeID,
  });
};

module.exports.updateEmployeePhotoUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
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

  const employeeID = req.body.id;
  const foundDataByIdObj = await this.getEmployeeDataByIdFromTableUtil({
    employeeID: employeeID,
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
      message: "Employee not found.",
      data: {},
    };
  }
  const employeeCode = foundDataByIdObj.data.employeeCode;
  const imageData = foundDataByIdObj?.data?.imageData ?? null;
  const file = req.file;

  const updatedPhotoObj = await this.updateEmployeeImageInFSUtil({
    employeeID: employeeID,
    employeeCode: employeeCode,
    imageData: imageData,
    file: file,
  });

  if (updatedPhotoObj?.status === "error") {
    return updatedPhotoObj;
  }

  const newEmployeePhoto = {
    id: employeeID,
    imageData: updatedPhotoObj.data,
    dateModified: new Date(),
  };

  const updatedEmployeePhotoSet = {
    $set: newEmployeePhoto,
  };

  return await this.updateDataInEmployeeTableUtil({
    newDataObject: newEmployeePhoto,
    updatedDataSet: updatedEmployeePhotoSet,
    employeeID: employeeID,
  });
};

module.exports.updateEmployeeNameUtil = async ({ req }) => {
  const validateEmployeeNameObj =
    await EmployeesValidationsUtility.validateAddNewEmployeeNameUtil({ req });
  if (validateEmployeeNameObj?.status === "error") {
    return validateEmployeeNameObj;
  }
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }

  const employeeID = req.body.id;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;

  const foundEmployeeByIdObj = await this.getEmployeeDataByIdFromTableUtil({
    employeeID: employeeID,
  });
  if (foundEmployeeByIdObj?.status === "error") {
    return foundEmployeeByIdObj;
  }

  const newEmployeeNames = {
    id: employeeID,
    name: {
      firstname: firstname,
      lastname: lastname,
    },
    dateModified: new Date(),
  };

  const updatedEmployeeNamesSet = {
    $set: newEmployeeNames,
  };

  return await this.updateDataInEmployeeTableUtil({
    newDataObject: newEmployeeNames,
    updatedDataSet: updatedEmployeeNamesSet,
    employeeID: employeeID,
  });
};

module.exports.updateEmployeePreferredNameUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }
  const validateEmployeePreferredNameObj =
    await EmployeesValidationsUtility.validateAddNewEmployeePreferredNameUtil({
      req,
    });
  if (validateEmployeePreferredNameObj?.status === "error") {
    return validateEmployeePreferredNameObj;
  }

  const employeeID = req.body.id;
  const preferredName = req.body.preferredName;

  const foundEmployeeByIdObj = await this.getEmployeeDataByIdFromTableUtil({
    employeeID: employeeID,
  });
  if (foundEmployeeByIdObj?.status === "error") {
    return foundEmployeeByIdObj;
  }

  const newEmployeePreferredName = {
    id: employeeID,
    preferredName: preferredName,
    dateModified: new Date(),
  };

  const updatedEmployeePreferredNameSet = {
    $set: newEmployeePreferredName,
  };

  return await this.updateDataInEmployeeTableUtil({
    newDataObject: newEmployeePreferredName,
    updatedDataSet: updatedEmployeePreferredNameSet,
    employeeID: employeeID,
  });
};

module.exports.updateEmployeeAddressUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }

  const employeeID = req.body.id;
  const foundEmployeeByIdObj = await this.getEmployeeDataByIdFromTableUtil({
    employeeID: employeeID,
  });
  if (foundEmployeeByIdObj?.status === "error") {
    return foundEmployeeByIdObj;
  }

  const validateUpdateEmployeeAddressObj =
    await EmployeesValidationsUtility.validateUpdateEmployeeAddressUtil({
      req,
    });
  if (validateUpdateEmployeeAddressObj?.status === "error") {
    return validateUpdateEmployeeAddressObj;
  }

  const newEmployeeAddress = {
    id: employeeID,
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

  const updatedEmployeeAddressSet = {
    $set: newEmployeeAddress,
  };

  return await this.updateDataInEmployeeTableUtil({
    newDataObject: newEmployeeAddress,
    updatedDataSet: updatedEmployeeAddressSet,
    employeeID: employeeID,
  });
};

module.exports.updateEmployeePhoneUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
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

  const employeeID = req.body.id;
  const phone = req.body.phone;

  const foundEmployeeByIdObj = await this.getEmployeeDataByIdFromTableUtil({
    employeeID: employeeID,
  });
  if (foundEmployeeByIdObj?.status === "error") {
    return foundEmployeeByIdObj;
  }

  const foundEmployeeByPhoneObj =
    await CommonApisUtility.getDataByPhoneFromSchemaUtil({
      schema: EmployeesSchema,
      schemaName: "Employee",
      phone: phone,
    });
  if (
    foundEmployeeByPhoneObj?.status === "success" &&
    foundEmployeeByPhoneObj?.data?.id !== employeeID
  ) {
    return {
      status: "error",
      message: `Another employee is already registered with same phone number ${phone}. Please choose a different phone number.`,
      data: {},
    };
  }

  const newEmployeePhone = {
    id: employeeID,
    phone: phone,
    dateModified: new Date(),
  };

  const updatedEmployeePhoneSet = {
    $set: newEmployeePhone,
  };

  return await this.updateDataInEmployeeTableUtil({
    newDataObject: newEmployeePhone,
    updatedDataSet: updatedEmployeePhoneSet,
    employeeID: employeeID,
  });
};

module.exports.updateEmployeeDepartmentUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }
  if (!req?.body?.departmentID || req.body.departmentID === "") {
    return {
      status: "error",
      message: `Department id is required.`,
      data: {},
    };
  }
  if (!req?.body?.employeeRoleID || req.body.employeeRoleID === "") {
    return {
      status: "error",
      message: `Role id is required.`,
      data: {},
    };
  }

  const employeeID = req.body.id;
  const departmentID = req.body.departmentID;
  const employeeRoleID = req.body.employeeRoleID;

  const foundEmployeeByIdObj = await this.getEmployeeDataByIdFromTableUtil({
    employeeID: employeeID,
  });
  if (foundEmployeeByIdObj?.status === "error") {
    return foundEmployeeByIdObj;
  }

  const validateDepartmentObj =
    await EmployeesValidationsUtility.apiValidationForDepartmentUtil({
      req,
    });
  if (validateDepartmentObj?.status === "error") {
    return validateDepartmentObj;
  }

  const validateEmployeeRoleObj =
    await EmployeesValidationsUtility.apiValidationForEmployeeRoleUtil({
      req,
    });
  if (validateEmployeeRoleObj?.status === "error") {
    return validateEmployeeRoleObj;
  }

  const validateEmployeeRoleInDepartmentObj =
    await EmployeesValidationsUtility.apiValidationRoleFromDepartmentUtil({
      req,
    });
  if (validateEmployeeRoleInDepartmentObj?.status === "error") {
    return validateEmployeeRoleInDepartmentObj;
  }

  const newEmployeeDepartment = {
    id: employeeID,
    departmentID: departmentID,
    employeeRoleID: employeeRoleID,
    dateModified: new Date(),
  };

  const updatedEmployeeDepartmentSet = {
    $set: newEmployeeDepartment,
  };

  return await this.updateDataInEmployeeTableUtil({
    newDataObject: newEmployeeDepartment,
    updatedDataSet: updatedEmployeeDepartmentSet,
    employeeID: employeeID,
  });
};

module.exports.updateEmployeeGenderUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
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

  const employeeID = req.body.id;
  const genderID = req.body.genderID;

  const foundEmployeeByIdObj = await this.getEmployeeDataByIdFromTableUtil({
    employeeID: employeeID,
  });
  if (foundEmployeeByIdObj?.status === "error") {
    return foundEmployeeByIdObj;
  }

  const foundGenderByIdObj =
    await EmployeesValidationsUtility.apiValidationForGenderUtil({ req: req });
  if (foundGenderByIdObj?.status === "error") {
    return foundGenderByIdObj;
  }

  const newEmployeeGender = {
    id: employeeID,
    genderID: genderID,
    dateModified: new Date(),
  };

  const updatedEmployeeGenderSet = {
    $set: newEmployeeGender,
  };

  return await this.updateDataInEmployeeTableUtil({
    newDataObject: newEmployeeGender,
    updatedDataSet: updatedEmployeeGenderSet,
    employeeID: employeeID,
  });
};

module.exports.updateEmployeeStatusUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }
  if (!req?.body?.statusID || req.body.statusID === "") {
    return {
      status: "error",
      message: `Status is required.`,
      data: {},
    };
  }

  const employeeID = req.body.id;
  const statusID = req.body.statusID;

  const foundEmployeeByIdObj = await this.getEmployeeDataByIdFromTableUtil({
    employeeID: employeeID,
  });
  if (foundEmployeeByIdObj?.status === "error") {
    return foundEmployeeByIdObj;
  }

  const foundStatusByIdObj =
    await EmployeesValidationsUtility.apiValidationForStatusUtil({ req: req });
  if (foundStatusByIdObj?.status === "error") {
    return foundStatusByIdObj;
  }

  const newEmployeeStatus = {
    id: employeeID,
    statusID: statusID,
    dateOfLeaving: "",
    reasonOfLeaving: "",
    dateModified: new Date(),
  };

  const updatedEmployeeStatusSet = {
    $set: newEmployeeStatus,
  };

  return await this.updateDataInEmployeeTableUtil({
    newDataObject: newEmployeeStatus,
    updatedDataSet: updatedEmployeeStatusSet,
    employeeID: employeeID,
  });
};

module.exports.updateEmployeeDobUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }
  if (!req?.body?.dateOfBirth || req.body.dateOfBirth === "") {
    return {
      status: "error",
      message: "Employee date of birth is required.",
      data: {},
    };
  }
  if (!CommonUtility.isValidDate({ date: req.body.dateOfBirth })) {
    return {
      status: "error",
      message: "Employee date of birth is invalid.",
      data: {},
    };
  }

  const employeeID = req.body.id;
  const dateOfBirth = req.body.dateOfBirth;

  const foundEmployeeByIdObj = await this.getEmployeeDataByIdFromTableUtil({
    employeeID: employeeID,
  });
  if (foundEmployeeByIdObj?.status === "error") {
    return foundEmployeeByIdObj;
  }

  const newEmployeeDob = {
    id: employeeID,
    dateOfBirth: new Date(dateOfBirth),
    dateModified: new Date(),
  };

  const updatedEmployeeDobSet = {
    $set: newEmployeeDob,
  };

  return await this.updateDataInEmployeeTableUtil({
    newDataObject: newEmployeeDob,
    updatedDataSet: updatedEmployeeDobSet,
    employeeID: employeeID,
  });
};

module.exports.updateEmployeeDojUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }
  if (!req?.body?.dateOfJoining || req.body.dateOfJoining === "") {
    return {
      status: "error",
      message: "Employee date of joining is required.",
      data: {},
    };
  }
  if (!CommonUtility.isValidDate({ date: req.body.dateOfJoining })) {
    return {
      status: "error",
      message: "Employee date of joining is invalid.",
      data: {},
    };
  }

  const employeeID = req.body.id;
  const dateOfJoining = req.body.dateOfJoining;

  const foundEmployeeByIdObj = await this.getEmployeeDataByIdFromTableUtil({
    employeeID: employeeID,
  });
  if (foundEmployeeByIdObj?.status === "error") {
    return foundEmployeeByIdObj;
  }

  const newEmployeeDoj = {
    id: employeeID,
    dateOfJoining: new Date(dateOfJoining),
    dateModified: new Date(),
  };

  const updatedEmployeeDojSet = {
    $set: newEmployeeDoj,
  };

  return await this.updateDataInEmployeeTableUtil({
    newDataObject: newEmployeeDoj,
    updatedDataSet: updatedEmployeeDojSet,
    employeeID: employeeID,
  });
};

module.exports.employeeLayOffUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }
  if (!req?.body?.dateOfLeaving || req.body.dateOfLeaving === "") {
    return {
      status: "error",
      message: "Employee date of leaving is required.",
      data: {},
    };
  }
  if (!CommonUtility.isValidDate({ date: req.body.dateOfLeaving })) {
    return {
      status: "error",
      message: "Employee date of leaving is invalid.",
      data: {},
    };
  }
  if (!req?.body?.reasonOfLeaving || req.body.reasonOfLeaving === "") {
    return {
      status: "error",
      message: "Reason of leaving is required.",
      data: {},
    };
  }
  if (!req?.body?.statusID || req.body.statusID === "") {
    return {
      status: "error",
      message: `Status is required.`,
      data: {},
    };
  }

  const employeeID = req.body.id;
  const dateOfLeaving = req.body.dateOfLeaving;
  const reasonOfLeaving = req.body.reasonOfLeaving;
  const statusID = req.body.statusID;

  const foundEmployeeByIdObj = await this.getEmployeeDataByIdFromTableUtil({
    employeeID: employeeID,
  });
  if (foundEmployeeByIdObj?.status === "error") {
    return foundEmployeeByIdObj;
  }

  const foundStatusByIdObj =
    await EmployeesValidationsUtility.apiValidationForStatusUtil({
      req: req,
    });
  if (foundStatusByIdObj?.status === "error") {
    return foundStatusByIdObj;
  }

  const newEmployeeLayOff = {
    id: employeeID,
    dateOfLeaving: new Date(dateOfLeaving),
    reasonOfLeaving: reasonOfLeaving,
    statusID: statusID,
    dateModified: new Date(),
  };

  const updatedEmployeeLayOffSet = {
    $set: newEmployeeLayOff,
  };

  return await this.updateDataInEmployeeTableUtil({
    newDataObject: newEmployeeLayOff,
    updatedDataSet: updatedEmployeeLayOffSet,
    employeeID: employeeID,
  });
};

module.exports.changeEmployeePasswordUtil = async ({ req }) => {
  const changePasswordValidity = await CommonUtility.changePasswordValidityUtil(
    { req }
  );
  if (changePasswordValidity.status === "error") {
    return changePasswordValidity;
  }

  const currentPassword = changePasswordValidity.data.currentPassword;
  const newPassword = changePasswordValidity.data.newPassword;
  const jwttoken = changePasswordValidity.data.jwttoken;

  const foundEmpLoginObj =
    await EmployeesLoginUtility.getEmployeeLoginByJwtTokenUtil({
      req: {
        body: {
          jwtToken: jwttoken,
        },
      },
    });

  if (foundEmpLoginObj?.status === "error") {
    return {
      status: "error",
      message: `Password doesn't change. You are not logged in to change the password. ${foundEmpLoginObj?.message}`,
      data: {},
    };
  }
  if (foundEmpLoginObj?.data?.isLogout) {
    return {
      status: "error",
      message: `Password doesn't change. You are not logged in to change the password. ${foundEmpLoginObj?.message}`,
      data: {},
    };
  }
  const employeeID = foundEmpLoginObj?.data?.employeeData?.id ?? null;

  const foundObj = await CommonApisUtility.getDataByDualKeysFromSchemaUtil({
    schema: EmployeesSchema,
    schemaName: "Employee",
    key1Value: employeeID,
    key2Value: currentPassword,
    key1Name: "id",
    key2Name: "password",
  });

  if (foundObj?.status === "error") {
    return {
      status: "error",
      message: `Password doesn't change. Current password is wrong.`,
      data: {},
    };
  }

  const newEmployeePassword = {
    id: employeeID,
    password: newPassword,
    dateModified: new Date(),
  };

  const updatedEmployeePasswordSet = {
    $set: newEmployeePassword,
  };

  const updatedDataObj = await this.updateDataInEmployeeTableUtil({
    newDataObject: newEmployeePassword,
    updatedDataSet: updatedEmployeePasswordSet,
    employeeID: employeeID,
  });
  if (updatedDataObj?.status === "error") {
    return {
      status: "error",
      message: `Your password doesn't changed. ${updatedDataObj?.message}`,
      data: {},
    };
  }
  return {
    status: "error",
    message: `Your password is changed successfully.`,
    data: {},
  };
};
