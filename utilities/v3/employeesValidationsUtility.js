const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");
const EmployeesSchema = require("../../model/v3/employees");
const CountriesSchema = require("../../model/v3/countries");
const StatesSchema = require("../../model/v3/states");
const CitiesSchema = require("../../model/v3/cities");
const DepartmentsSchema = require("../../model/v3/departments");
const GendersSchema = require("../../model/v3/genders");
const EmployeeRolesSchema = require("../../model/v3/employeeRoles");
const StatusesSchema = require("../../model/v3/statuses");

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

module.exports.getEmployeeRoleDetailsByUserRoleId = async ({
  employeeRoleID,
}) => {
  const foundEmployeeRoleObject =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: EmployeeRolesSchema,
      schemaName: "Employee role",
      dataID: employeeRoleID,
    });
  if (
    foundEmployeeRoleObject.status === "success" &&
    Object.keys(foundEmployeeRoleObject?.data).length > 0
  ) {
    return foundEmployeeRoleObject;
  }
  return {
    status: foundEmployeeRoleObject?.status,
    message: foundEmployeeRoleObject?.message,
    data: {
      employeeRoleID: employeeRoleID,
    },
  };
};

module.exports.getStatusDetailsByUserStatusId = async ({ statusID }) => {
  const foundStatusObject = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: StatusesSchema,
    schemaName: "Status",
    dataID: statusID,
  });
  if (
    foundStatusObject.status === "success" &&
    Object.keys(foundStatusObject?.data).length > 0
  ) {
    return foundStatusObject;
  }
  return {
    status: foundStatusObject?.status,
    message: foundStatusObject?.message,
    data: {
      statusID: statusID,
    },
  };
};

module.exports.getAddressRelatedDetails = async ({ employeeData }) => {
  const countryID = employeeData.address.countryID;
  const foundCountryObject = await this.getCountryDetailsByCountryId({
    countryID: countryID,
  });

  const stateID = employeeData.address.stateID;
  const foundStateObject = await this.getStateDetailsByStateId({
    stateID: stateID,
  });

  const cityID = employeeData.address.cityID;
  const foundCityObject = await this.getCityDetailsByCityId({
    cityID: cityID,
  });
  return {
    countryDetails: foundCountryObject.data,
    stateDetails: foundStateObject.data,
    cityDetails: foundCityObject.data,
  };
};

module.exports.getEmployeeRoleAndStatusRelatedDetails = async ({
  employeeData,
}) => {
  const employeeRoleID = employeeData.employeeRoleID;
  const foundEmployeeRoleObject = await this.getEmployeeRoleDetailsByUserRoleId(
    {
      employeeRoleID: employeeRoleID,
    }
  );

  const statusID = employeeData.statusID;
  const foundStatusObject = await this.getStatusDetailsByUserStatusId({
    statusID: statusID,
  });

  return {
    employeeRoleDetails: foundEmployeeRoleObject.data,
    statusDetails: foundStatusObject.data,
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

module.exports.getDepartmentRelatedDetailsById = async ({ departmentID }) => {
  const foundDepartmentObject =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: DepartmentsSchema,
      schemaName: "Department",
      dataID: departmentID,
    });
  if (
    foundDepartmentObject?.status === "success" &&
    Object.keys(foundDepartmentObject?.data).length > 0
  ) {
    return foundDepartmentObject;
  }
  return {
    ...foundDepartmentObject,
    data: {
      departmentID: departmentID && departmentID !== "" ? departmentID : "",
    },
  };
};

module.exports.getSingleEmployeeWithAllDetails = async ({ employeeData }) => {
  const { countryDetails, stateDetails, cityDetails } =
    await this.getAddressRelatedDetails({ employeeData });
  const { employeeRoleDetails, statusDetails } =
    await this.getEmployeeRoleAndStatusRelatedDetails({ employeeData });
  const genderDetailsObject = await this.getGenderRelatedDetailsByGenderId({
    genderID: employeeData?.genderID,
  });
  const departmentDetailsObj = await this.getDepartmentRelatedDetailsById({
    departmentID: employeeData?.departmentID,
  });
  return {
    id: employeeData?.id,
    employeeCode: employeeData?.employeeCode,
    employeeNumber: employeeData?.employeeNumber,
    email: employeeData?.email,
    password: employeeData?.password,
    name: employeeData?.name,
    preferredName: employeeData?.preferredName,
    address: {
      address: employeeData?.address?.address,
      street: employeeData?.address?.street,
      landmark: employeeData?.address?.landmark,
      countryDetails: countryDetails,
      stateDetails: stateDetails,
      cityDetails: cityDetails,
      pincode: employeeData?.address?.pincode,
    },
    phone: employeeData?.phone,
    departmentDetails: departmentDetailsObj?.data,
    genderDetails: genderDetailsObject?.data,
    employeeRoleDetails: employeeRoleDetails,
    statusDetails: statusDetails,
    imageData: employeeData?.imageData,
    dateOfBirth: employeeData?.dateOfBirth,
    dateOfJoining: employeeData?.dateOfJoining,
    dateOfLeaving: employeeData?.dateOfLeaving,
    reasonOfLeaving: employeeData?.reasonOfLeaving,
    dateAdded: employeeData?.dateAdded,
    dateModified: employeeData?.dateModified,
  };
};

module.exports.getAllEmployeesWithAllDetails = async ({ allEmployees }) => {
  return Promise.all(
    allEmployees?.map(async (employeeData) => {
      const employeeDetails = await this.getSingleEmployeeWithAllDetails({
        employeeData,
      });
      return employeeDetails;
    })
  );
};

module.exports.validateAddNewEmployeeNameUtil = async ({ req }) => {
  if (!req?.body?.firstname || req.body.firstname === "") {
    return {
      status: "error",
      message: "First name is required.",
      data: {},
    };
  }
  if (!CommonUtility.isValidOnlyCharacters({ text: req.body.firstname })) {
    return {
      status: "error",
      message:
        "First name is not valid. First name must only contains characters.",
      data: {},
    };
  }
  if (!req?.body?.lastname || req.body.lastname === "") {
    return {
      status: "error",
      message: "Last name is required.",
      data: {},
    };
  }
  if (!CommonUtility.isValidOnlyCharacters({ text: req.body.lastname })) {
    return {
      status: "error",
      message:
        "Last name is not valid. Last name must only contains characters.",
      data: {},
    };
  }
  return {
    status: "success",
    message: "All name details passed in request are valid.",
    data: {},
  };
};

module.exports.validateAddNewEmployeePreferredNameUtil = async ({ req }) => {
  if (!req?.body?.preferredName || req.body.preferredName === "") {
    return {
      status: "error",
      message: "Preferred name is required.",
      data: {},
    };
  }
  if (!CommonUtility.isValidOnlyCharacters({ text: req.body.preferredName })) {
    return {
      status: "error",
      message:
        "Preferred name is not valid. Preferred name must only contains characters.",
      data: {},
    };
  }
  return {
    status: "success",
    message: "All name details passed in request are valid.",
    data: {},
  };
};

module.exports.validateAddNewEmployeeEmailUtil = async ({ req }) => {
  if (!req?.body?.email || req.body.email === "") {
    return {
      status: "error",
      message: "Email address is required.",
      data: {},
    };
  }
  if (!CommonUtility.isValidEmail({ email: req.body.email })) {
    return {
      status: "error",
      message: "Email address is invalid.",
      data: {},
    };
  }
  return {
    status: "success",
    message: "Email details passed in request are valid.",
    data: {},
  };
};

module.exports.validateAddNewEmployeePasswordUtil = async ({ req }) => {
  if (!req?.body?.password || req.body.password === "") {
    return {
      status: "error",
      message: "Password is required.",
      data: {},
    };
  }
  const passwordValidationObj = CommonUtility.isValidPassword({
    password: req.body.password,
  });
  if (!passwordValidationObj?.isValid) {
    return {
      status: "error",
      message: `${passwordValidationObj?.message} password is invalid. Password must contains at least one uppercase letter, at least one lowercase letter, at least one digit, at least one special character(!, @, #, $, %, ^, &, *, (, ),\, -, +, .) and should be 8 or more characters long.`,
      data: {},
    };
  }
  return {
    status: "success",
    message: "Password details passed in request are valid.",
    data: {},
  };
};

module.exports.validateAddNewEmployeeAddressUtil = async ({ req }) => {
  if (!req?.body?.address || req.body.address === "") {
    return {
      status: "error",
      message: "Address is required.",
      data: {},
    };
  }
  if (!req?.body?.street || req.body.street === "") {
    return {
      status: "error",
      message: "Street is required.",
      data: {},
    };
  }
  if (!req?.body?.landmark || req.body.landmark === "") {
    return {
      status: "error",
      message: "Landmark is required.",
      data: {},
    };
  }
  if (!req?.body?.countryID || req.body.countryID === "") {
    return {
      status: "error",
      message: "Country id is required.",
      data: {},
    };
  }
  if (!req?.body?.stateID || req.body.stateID === "") {
    return {
      status: "error",
      message: "State id is required.",
      data: {},
    };
  }
  if (!req?.body?.cityID || req.body.cityID === "") {
    return {
      status: "error",
      message: "City id is required.",
      data: {},
    };
  }
  if (!req?.body?.pincode || req.body.pincode === "") {
    return {
      status: "error",
      message: "Pincode is required.",
      data: {},
    };
  }
  return {
    status: "success",
    message: "All address details passed in request are valid.",
    data: {},
  };
};

module.exports.apiValidationForEmailUtil = async ({ req }) => {
  const email = req.body.email;
  const foundObj = await CommonApisUtility.getDataByEmailFromSchemaUtil({
    schema: EmployeesSchema,
    schemaName: "Employee",
    emailID: email,
  });
  if (foundObj?.status === "success") {
    return {
      status: "error",
      message: `Another employee is already registered with the same email "${email}"`,
      data: {},
    };
  }
  return {
    status: "success",
    message: `No employee is registered with email "${email}"`,
    data: {},
  };
};

module.exports.apiValidationForPhoneUtil = async ({ req }) => {
  const phone = req.body.phone;
  const foundObj = await CommonApisUtility.getDataByPhoneFromSchemaUtil({
    schema: EmployeesSchema,
    schemaName: "Employee",
    phone: phone,
  });
  if (foundObj?.status === "success") {
    return {
      status: "error",
      message: `Another employee is already registered with the same phone "${phone}"`,
      data: {},
    };
  }
  return {
    status: "success",
    message: `No employee is registered with phone "${phone}"`,
    data: {},
  };
};

module.exports.apiValidationForCountryUtil = async ({ req }) => {
  const countryID = req.body.countryID;
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CountriesSchema,
    schemaName: "Country",
    dataID: countryID,
  });
  return foundObj;
};

module.exports.apiValidationForStateUtil = async ({ req }) => {
  const stateID = req.body.stateID;
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: StatesSchema,
    schemaName: "State",
    dataID: stateID,
  });
  return foundObj;
};

module.exports.apiValidationForCityUtil = async ({ req }) => {
  const cityID = req.body.cityID;
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CitiesSchema,
    schemaName: "City",
    dataID: cityID,
  });
  return foundObj;
};

module.exports.apiValidationForGenderUtil = async ({ req }) => {
  const genderID = req.body.genderID;
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: GendersSchema,
    schemaName: "Gender",
    dataID: genderID,
  });
  return foundObj;
};

module.exports.apiValidationForDepartmentUtil = async ({ req }) => {
  const departmentID = req.body.departmentID;
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: DepartmentsSchema,
    schemaName: "Department",
    dataID: departmentID,
  });
  return foundObj;
};

module.exports.apiValidationForEmployeeRoleUtil = async ({ req }) => {
  const employeeRoleID = req.body.employeeRoleID;
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: EmployeeRolesSchema,
    schemaName: "Employee role",
    dataID: employeeRoleID,
  });
  return foundObj;
};

module.exports.apiValidationRoleFromDepartmentUtil = async ({ req }) => {
  const employeeRoleID = req.body.employeeRoleID;
  const departmentID = req.body.departmentID;
  const allRolesDataObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: EmployeeRolesSchema,
    schemaName: "Employees",
  });

  if (allRolesDataObj?.status === "error") {
    return {
      status: "error",
      message: `Employee role not found in the given department ${departmentID}`,
      data: {},
    };
  }

  const foundRoleFromDepartment = allRolesDataObj?.data?.find(
    (roleData) =>
      roleData?.departmentID === departmentID && roleData?.id === employeeRoleID
  );

  if (
    foundRoleFromDepartment &&
    Object.keys(foundRoleFromDepartment).length > 0
  ) {
    return {
      status: "success",
      message: `Employee role found in the given department ${departmentID}`,
      data: {},
    };
  }

  return {
    status: "error",
    message: `Employee role not found in the given department ${departmentID}`,
    data: {},
  };
};

module.exports.apiValidationForStatusUtil = async ({ req }) => {
  const statusID = req.body.statusID;
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: StatusesSchema,
    schemaName: "Status",
    dataID: statusID,
  });
  return foundObj;
};

module.exports.apiValidationStateFromCountryUtil = async ({ req }) => {
  const countryID = req.body.countryID;
  const stateID = req.body.stateID;
  const allStatesDataObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: StatesSchema,
    schemaName: "States",
  });

  if (allStatesDataObj?.status === "error") {
    return {
      status: "error",
      message: `State not found in the given country ${countryID}`,
      data: {},
    };
  }

  const foundStateObj = allStatesDataObj?.data?.find(
    (stateData) =>
      stateData?.countryID === countryID && stateData?.id === stateID
  );

  if (foundStateObj && Object.keys(foundStateObj).length > 0) {
    return {
      status: "success",
      message: `State found in the given country ${countryID}`,
      data: {},
    };
  }

  return {
    status: "error",
    message: `State not found in the given country ${countryID}`,
    data: {},
  };
};

module.exports.apiValidationCityFromCountryUtil = async ({ req }) => {
  const countryID = req.body.countryID;
  const cityID = req.body.cityID;
  const allCitiesDataObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: CitiesSchema,
    schemaName: "Cities",
  });

  if (allCitiesDataObj?.status === "error") {
    return {
      status: "error",
      message: `City not found in the given country ${countryID}`,
      data: {},
    };
  }

  const foundCityObj = allCitiesDataObj?.data?.find(
    (cityData) => cityData?.countryID === countryID && cityData?.id === cityID
  );

  if (foundCityObj && Object.keys(foundCityObj).length > 0) {
    return {
      status: "success",
      message: `City found in the given country ${countryID}`,
      data: {},
    };
  }

  return {
    status: "error",
    message: `City not found in the given country ${countryID}`,
    data: {},
  };
};

module.exports.apiValidationCityFromStateUtil = async ({ req }) => {
  const stateID = req.body.stateID;
  const cityID = req.body.cityID;
  const allCitiesDataObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: CitiesSchema,
    schemaName: "Cities",
  });

  if (allCitiesDataObj?.status === "error") {
    return {
      status: "error",
      message: `City not found in the given state ${stateID}`,
      data: {},
    };
  }

  const foundCityObj = allCitiesDataObj?.data?.find(
    (cityData) => cityData?.stateID === stateID && cityData?.id === cityID
  );

  if (foundCityObj && Object.keys(foundCityObj).length > 0) {
    return {
      status: "success",
      message: `City found in the given state ${stateID}`,
      data: {},
    };
  }

  return {
    status: "error",
    message: `City not found in the given state ${stateID}`,
    data: {},
  };
};

module.exports.apiValidationUtil = async ({ req }) => {
  const validateEmailObj = await this.apiValidationForEmailUtil({ req });
  if (validateEmailObj?.status === "error") {
    return validateEmailObj;
  }

  const validatePhoneObj = await this.apiValidationForPhoneUtil({ req });
  if (validatePhoneObj?.status === "error") {
    return validatePhoneObj;
  }

  const validateCountryObj = await this.apiValidationForCountryUtil({ req });
  if (validateCountryObj?.status === "error") {
    return validateCountryObj;
  }

  const validateStateObj = await this.apiValidationForStateUtil({ req });
  if (validateStateObj?.status === "error") {
    return validateStateObj;
  }

  const validateCityObj = await this.apiValidationForCityUtil({ req });
  if (validateCityObj?.status === "error") {
    return validateCityObj;
  }

  const validateGenderObj = await this.apiValidationForGenderUtil({ req });
  if (validateGenderObj?.status === "error") {
    return validateGenderObj;
  }

  const validateDepartmentObj = await this.apiValidationForDepartmentUtil({
    req,
  });
  if (validateDepartmentObj?.status === "error") {
    return validateDepartmentObj;
  }

  const validateEmployeeRoleObj = await this.apiValidationForEmployeeRoleUtil({
    req,
  });
  if (validateEmployeeRoleObj?.status === "error") {
    return validateEmployeeRoleObj;
  }

  const validateEmployeeRoleInDepartmentObj =
    await this.apiValidationRoleFromDepartmentUtil({
      req,
    });
  if (validateEmployeeRoleInDepartmentObj?.status === "error") {
    return validateEmployeeRoleInDepartmentObj;
  }

  const validateStateInCountryObj =
    await this.apiValidationStateFromCountryUtil({
      req,
    });
  if (validateStateInCountryObj?.status === "error") {
    return validateStateInCountryObj;
  }

  const validateCityInCountryObj = await this.apiValidationCityFromCountryUtil({
    req,
  });
  if (validateCityInCountryObj?.status === "error") {
    return validateCityInCountryObj;
  }

  const validateCityInStateObj = await this.apiValidationCityFromStateUtil({
    req,
  });
  if (validateCityInStateObj?.status === "error") {
    return validateCityInStateObj;
  }

  const validateStatusObj = await this.apiValidationForStatusUtil({
    req,
  });
  if (validateStatusObj?.status === "error") {
    return validateStatusObj;
  }

  return {
    status: "success",
    message: "Api validation succeeded.",
    data: {},
  };
};

module.exports.validateAddNewEmployeeUtil = async ({ req }) => {
  const validateNameObj = await this.validateAddNewEmployeeNameUtil({ req });
  if (validateNameObj?.status === "error") {
    return validateNameObj;
  }
  const validatePreferredNameObj =
    await this.validateAddNewEmployeePreferredNameUtil({
      req,
    });
  if (validatePreferredNameObj?.status === "error") {
    return validatePreferredNameObj;
  }
  const validateEmailObj = await this.validateAddNewEmployeeEmailUtil({ req });
  if (validateEmailObj?.status === "error") {
    return validateEmailObj;
  }
  const validatePasswordObj = await this.validateAddNewEmployeePasswordUtil({
    req,
  });
  if (validatePasswordObj?.status === "error") {
    return validatePasswordObj;
  }
  const validateAddressObj = await this.validateAddNewEmployeeAddressUtil({
    req,
  });
  if (validateAddressObj?.status === "error") {
    return validateAddressObj;
  }
  if (!req?.body?.phone || req.body.phone === "") {
    return {
      status: "error",
      message: "Phone number is required.",
      data: {},
    };
  }
  if (!req?.body?.departmentID || req.body.departmentID === "") {
    return {
      status: "error",
      message: "Department is required.",
      data: {},
    };
  }
  if (!req?.body?.genderID || req.body.genderID === "") {
    return {
      status: "error",
      message: "Gender is required.",
      data: {},
    };
  }
  if (!req?.body?.employeeRoleID || req.body.employeeRoleID === "") {
    return {
      status: "error",
      message: "Employee role is required.",
      data: {},
    };
  }
  if (!req?.body?.statusID || req.body.statusID === "") {
    return {
      status: "error",
      message: "Employee status is required.",
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
  if (!req?.body?.dateOfJoining || req.body.dateOfJoining === "") {
    return {
      status: "error",
      message: "Employee joining date is required.",
      data: {},
    };
  }
  if (!CommonUtility.isValidDate({ date: req.body.dateOfJoining })) {
    return {
      status: "error",
      message: "Employee joining date is invalid.",
      data: {},
    };
  }
  const foundApiValidationObj = await this.apiValidationUtil({ req });
  if (foundApiValidationObj?.status === "error") {
    return foundApiValidationObj;
  }
  return {
    status: "success",
    message: "All details passed in request are valid.",
    data: {},
  };
};

module.exports.getNewEmployeeDataFilledSchema = ({
  req,
  employeeID,
  employeeCode,
  employeeNumber,
  uploadedFileData,
}) => {
  const employee = new EmployeesSchema({
    id: employeeID,
    employeeCode: employeeCode,
    employeeNumber: employeeNumber,
    email: req.body.email,
    password: req.body.password,
    name: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    },
    preferredName: req.body.preferredName,
    address: {
      address: req.body.address,
      street: req.body.street,
      landmark: req.body.landmark,
      countryID: req.body.countryID,
      stateID: req.body.stateID,
      cityID: req.body.cityID,
      pincode: req.body.pincode,
    },
    phone: req.body.phone,
    departmentID: req.body.departmentID,
    genderID: req.body.genderID,
    employeeRoleID: req.body.employeeRoleID,
    statusID: req.body.statusID,
    imageData: uploadedFileData,
    dateOfBirth: req.body.dateOfBirth,
    dateOfJoining: req.body.dateOfJoining,
    dateOfLeaving: "",
    reasonOfLeaving: "",
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  return employee;
};

module.exports.validateUpdateEmployeeAddressUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Employee id is required.`,
      data: {},
    };
  }
  const validateAddressObj = await this.validateAddNewEmployeeAddressUtil({
    req,
  });
  if (validateAddressObj?.status === "error") {
    return validateAddressObj;
  }

  const validateCountryObj = await this.apiValidationForCountryUtil({ req });
  if (validateCountryObj?.status === "error") {
    return validateCountryObj;
  }

  const validateStateObj = await this.apiValidationForStateUtil({ req });
  if (validateStateObj?.status === "error") {
    return validateStateObj;
  }

  const validateCityObj = await this.apiValidationForCityUtil({ req });
  if (validateCityObj?.status === "error") {
    return validateCityObj;
  }

  const validateStateInCountryObj =
    await this.apiValidationStateFromCountryUtil({
      req,
    });
  if (validateStateInCountryObj?.status === "error") {
    return validateStateInCountryObj;
  }

  const validateCityInCountryObj = await this.apiValidationCityFromCountryUtil({
    req,
  });
  if (validateCityInCountryObj?.status === "error") {
    return validateCityInCountryObj;
  }

  const validateCityInStateObj = await this.apiValidationCityFromStateUtil({
    req,
  });
  if (validateCityInStateObj?.status === "error") {
    return validateCityInStateObj;
  }

  return {
    status: "success",
    message: "Update api validation succeeded.",
    data: {},
  };
};
