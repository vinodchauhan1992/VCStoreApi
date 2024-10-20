const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");
const CustomersSchema = require("../../model/v3/customers");
const CountriesSchema = require("../../model/v3/countries");
const StatesSchema = require("../../model/v3/states");
const CitiesSchema = require("../../model/v3/cities");
const GendersSchema = require("../../model/v3/genders");

module.exports.getAddressRelatedDetails = async ({ customerData }) => {
  const countryID = customerData.address.countryID;
  const foundCountryObject = await CommonUtility.getCountryDetailsByCountryId({
    countryID: countryID,
  });

  const stateID = customerData.address.stateID;
  const foundStateObject = await CommonUtility.getStateDetailsByStateId({
    stateID: stateID,
  });

  const cityID = customerData.address.cityID;
  const foundCityObject = await CommonUtility.getCityDetailsByCityId({
    cityID: cityID,
  });
  return {
    countryDetails: foundCountryObject.data,
    stateDetails: foundStateObject.data,
    cityDetails: foundCityObject.data,
  };
};

module.exports.getSingleCustomerWithAllDetails = async ({ customerData }) => {
  const { countryDetails, stateDetails, cityDetails } =
    await this.getAddressRelatedDetails({ customerData });
  const genderDetailsObject =
    await CommonUtility.getGenderRelatedDetailsByGenderId({
      genderID: customerData?.genderID,
    });
  return {
    id: customerData?.id,
    customerNumber: customerData?.customerNumber,
    email: customerData?.email,
    username: customerData?.username,
    customerCode: customerData?.customerCode,
    password: customerData?.password,
    name: customerData?.name,
    address: {
      address: customerData?.address?.address,
      street: customerData?.address?.street,
      landmark: customerData?.address?.landmark,
      countryDetails: countryDetails,
      cityDetails: cityDetails,
      stateDetails: stateDetails,
      pincode: customerData?.address?.pincode,
    },
    phone: customerData?.phone,
    isActive: customerData?.isActive ?? false,
    genderDetails: genderDetailsObject?.data,
    incomeDetails: customerData?.incomeDetails,
    imageData: customerData?.imageData,
    dateOfBirth: customerData?.dateOfBirth,
    dateOfRegistration: customerData?.dateOfRegistration,
    dateAdded: customerData?.dateAdded,
    dateModified: customerData?.dateModified,
  };
};

module.exports.getAllCustomersWithAllDetails = async ({ allCustomers }) => {
  return Promise.all(
    allCustomers?.map(async (customerData) => {
      const customerDetails = await this.getSingleCustomerWithAllDetails({
        customerData: customerData,
      });
      return customerDetails;
    })
  );
};

module.exports.validateAddNewCustomerNameUtil = async ({ req }) => {
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

module.exports.validateAddNewCustomerUserNameUtil = async ({ req }) => {
  if (!req?.body?.username || req.body.username === "") {
    return {
      status: "error",
      message: "Username is required.",
      data: {},
    };
  }
  if (!CommonUtility.validCharactersForUsername({ text: req.body.username })) {
    return {
      status: "error",
      message: "Username is not valid. Username can only lowercase letters, numbers, underscores and dots.",
      data: {},
    };
  }
  return {
    status: "success",
    message: "All name details passed in request are valid.",
    data: {},
  };
};

module.exports.validateAddNewCustomerEmailUtil = async ({ req }) => {
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

module.exports.validateAddNewCustomerPasswordUtil = async ({ req }) => {
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

module.exports.validateAddNewCustomerAddressUtil = async ({ req }) => {
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
    schema: CustomersSchema,
    schemaName: "Customer",
    emailID: email,
  });
  if (foundObj?.status === "success") {
    return {
      status: "error",
      message: `Another customer is already registered with the same email "${email}"`,
      data: {},
    };
  }
  return {
    status: "success",
    message: `No customer is registered with email "${email}"`,
    data: {},
  };
};

module.exports.apiValidationForUsernameUtil = async ({ req }) => {
  const username = req.body.username;
  const foundObj = await CommonApisUtility.getDataByUsernameFromSchemaUtil({
    schema: CustomersSchema,
    schemaName: "Customer",
    username: username,
  });
  if (foundObj?.status === "success") {
    return {
      status: "error",
      message: `Another customer is already registered with the same username "${username}"`,
      data: {},
    };
  }
  return {
    status: "success",
    message: `No customer is registered with username "${username}"`,
    data: {},
  };
};

module.exports.apiValidationForPhoneUtil = async ({ req }) => {
  const phone = req.body.phone;
  const foundObj = await CommonApisUtility.getDataByPhoneFromSchemaUtil({
    schema: CustomersSchema,
    schemaName: "Customer",
    phone: phone,
  });
  if (foundObj?.status === "success") {
    return {
      status: "error",
      message: `Another customer is already registered with the same phone "${phone}"`,
      data: {},
    };
  }
  return {
    status: "success",
    message: `No customer is registered with phone "${phone}"`,
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

  const validateUsernameObj = await this.apiValidationForUsernameUtil({ req });
  if (validateUsernameObj?.status === "error") {
    return validateUsernameObj;
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
    message: "Api validation succeeded.",
    data: {},
  };
};

module.exports.validateAddNewCustomerUtil = async ({ req }) => {
  const validateNameObj = await this.validateAddNewCustomerNameUtil({ req });
  if (validateNameObj?.status === "error") {
    return validateNameObj;
  }
  const validateUserNameObj = await this.validateAddNewCustomerUserNameUtil({
    req,
  });
  if (validateUserNameObj?.status === "error") {
    return validateUserNameObj;
  }
  const validateEmailObj = await this.validateAddNewCustomerEmailUtil({ req });
  if (validateEmailObj?.status === "error") {
    return validateEmailObj;
  }
  const validatePasswordObj = await this.validateAddNewCustomerPasswordUtil({
    req,
  });
  if (validatePasswordObj?.status === "error") {
    return validatePasswordObj;
  }
  const validateAddressObj = await this.validateAddNewCustomerAddressUtil({
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
  if (!req?.body?.genderID || req.body.genderID === "") {
    return {
      status: "error",
      message: "Gender is required.",
      data: {},
    };
  }
  if (!req?.body?.dateOfBirth || req.body.dateOfBirth === "") {
    return {
      status: "error",
      message: `Customer's date of birth is required.`,
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
  if (!CommonUtility.isValidDate({ date: req.body.dateOfBirth })) {
    return {
      status: "error",
      message: `Customer's date of birth is invalid.`,
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

module.exports.getNewCustomerDataFilledSchema = ({
  req,
  customerID,
  customerCode,
  customerNumber,
  uploadedFileData,
}) => {
  const monthlyIncome = req.body.monthlyIncome;
  const annualIncome = monthlyIncome * 12;
  const customer = new CustomersSchema({
    id: customerID,
    customerNumber: customerNumber,
    email: req.body.email,
    username: req.body.username,
    customerCode: customerCode,
    password: req.body.password,
    name: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    },
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
    isActive: req?.body?.isActive ?? false,
    genderID: req.body.genderID,
    incomeDetails: {
      monthlyIncome: monthlyIncome,
      annualIncome: annualIncome,
    },
    imageData: uploadedFileData,
    dateOfBirth: req.body.dateOfBirth,
    dateOfRegistration: new Date(),
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  return customer;
};

module.exports.validateUpdateCustomerAddressUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }
  const validateAddressObj = await this.validateAddNewCustomerAddressUtil({
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
