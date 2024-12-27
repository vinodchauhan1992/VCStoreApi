const CustomersLoginSchema = require("../../model/v3/customersLogin");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");
const CustomersUtility = require("./customersUtility");
const AppIdsUtility = require("./appIdsUtility");

module.exports.getSingleCustomerLoginsWithAllCustomersUtil = async ({
  customerLoginData,
}) => {
  const customerID = customerLoginData.customerID;
  const req = { body: { id: customerID } };
  const foundCustomerDataByIDObj = await CustomersUtility.getCustomerByIDUtil({
    req,
  });
  let finalObj = {
    ...customerLoginData,
    customerData: {},
  };
  if (foundCustomerDataByIDObj?.status === "success") {
    finalObj = {
      ...finalObj,
      customerData: foundCustomerDataByIDObj?.data ?? {},
    };
  }
  const foundAppIdByAppIDObj = await AppIdsUtility.getAppIdByAppIdUtil({
    req: { body: { id: customerLoginData?.appID } },
  });
  if (foundAppIdByAppIDObj?.status === "success") {
    finalObj = {
      ...finalObj,
      appIdDetails: foundAppIdByAppIDObj?.data,
    };
  }
  return finalObj;
};

module.exports.getAllCustomerLoginsWithAllCustomersUtil = async ({
  allCustomerLoginsArray,
}) => {
  return Promise.all(
    allCustomerLoginsArray?.map(async (customerLoginData) => {
      const customerLoginDetails =
        await this.getSingleCustomerLoginsWithAllCustomersUtil({
          customerLoginData,
        });
      return customerLoginDetails;
    })
  );
};

module.exports.getAllCustomerLoginsUtil = async ({ req }) => {
  const customerLoginObject = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: CustomersLoginSchema,
    schemaName: "Customer Logins",
  });
  if (customerLoginObject?.status === "error") {
    return customerLoginObject;
  }

  const fullCustDetailsArr =
    await this.getAllCustomerLoginsWithAllCustomersUtil({
      allCustomerLoginsArray: customerLoginObject?.data ?? [],
    });

  return {
    ...customerLoginObject,
    data: fullCustDetailsArr,
  };
};

module.exports.getCustomerLoginsByCustIDUtil = async ({ req }) => {
  if (!req?.body?.customerID || req.body.customerID === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: [],
    };
  }
  const customerID = req.body.customerID;
  const customerLoginObject =
    await CommonApisUtility.getDataArrayByIdFromSchemaUtil({
      schema: CustomersLoginSchema,
      schemaName: "Customer",
      dataID: customerID,
      keyname: "customerID",
    });
  if (customerLoginObject?.status === "error") {
    return {
      ...customerLoginObject,
      message: `Customer login details not found with customer id ${customerID}`,
    };
  }

  const fullCustDetailsArr =
    await this.getAllCustomerLoginsWithAllCustomersUtil({
      allCustomerLoginsArray: customerLoginObject?.data ?? [],
    });

  return {
    ...customerLoginObject,
    message: `Customer login details found with customer id ${customerID}`,
    data: fullCustDetailsArr,
  };
};

module.exports.getCustomerLoginByLoginIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Login id is required.`,
      data: {},
    };
  }
  const customerLoginObject = await CommonApisUtility.getDataByIdFromSchemaUtil(
    {
      schema: CustomersLoginSchema,
      schemaName: "Customer Login",
      dataID: req.body.id,
    }
  );
  if (customerLoginObject?.status === "error") {
    return customerLoginObject;
  }

  const fullCustDetailsObj =
    await this.getSingleCustomerLoginsWithAllCustomersUtil({
      customerLoginData: customerLoginObject?.data,
    });

  return {
    ...customerLoginObject,
    data: fullCustDetailsObj,
  };
};

module.exports.getCustomerLoginsByCustUsernameUtil = async ({ req }) => {
  if (!req?.body?.username || req.body.username === "") {
    return {
      status: "error",
      message: `Username is required.`,
      data: [],
    };
  }
  const username = req.body.username;
  const customerLoginObject =
    await CommonApisUtility.getDataArrayByCodeFromSchemaUtil({
      schema: CustomersLoginSchema,
      schemaName: "Customer",
      dataCode: username,
      keyname: "username",
    });

  if (customerLoginObject?.status === "error") {
    return {
      ...customerLoginObject,
      message: `Customer login details not found with username ${username}`,
    };
  }

  const fullCustDetailsArr =
    await this.getAllCustomerLoginsWithAllCustomersUtil({
      allCustomerLoginsArray: customerLoginObject?.data ?? [],
    });

  return {
    ...customerLoginObject,
    message: `Customer login details found with username ${username}`,
    data: fullCustDetailsArr,
  };
};

module.exports.getCustomerLoginByJwtTokenUtil = async ({ req }) => {
  if (!req?.body?.jwtToken || req.body.jwtToken === "") {
    return {
      status: "error",
      message: `Jwt token is required.`,
      data: {},
    };
  }
  const jwtToken = req.body.jwtToken;
  const customerLoginObject =
    await CommonApisUtility.getDataByJwtTokenFromSchemaUtil({
      schema: CustomersLoginSchema,
      schemaName: "Customer Login",
      jwtToken: jwtToken,
    });
  if (customerLoginObject?.status === "error") {
    return customerLoginObject;
  }

  const fullCustDetailsObj =
    await this.getSingleCustomerLoginsWithAllCustomersUtil({
      customerLoginData: customerLoginObject?.data,
    });

  return {
    ...customerLoginObject,
    data: fullCustDetailsObj,
  };
};

module.exports.addNewCustomerLoginEntryUtil = async ({
  customerLoginData,
  jwtToken,
  appID,
}) => {
  if (!customerLoginData?.id || customerLoginData.id === "") {
    return {
      status: "error",
      message: "Invalid login. Customer id is required.",
      data: {},
    };
  }
  if (!customerLoginData?.username || customerLoginData.username === "") {
    return {
      status: "error",
      message: "Invalid login. Customer code is required.",
      data: {},
    };
  }
  if (!jwtToken || jwtToken === "") {
    return {
      status: "error",
      message: "Invalid login. Jwt token is required.",
      data: {},
    };
  }
  if (!appID || appID === "") {
    return {
      status: "error",
      message: "Invalid login. app id is required.",
      data: {},
    };
  }

  const newCustomerLogin = new CustomersLoginSchema({
    id: CommonUtility.getUniqueID(),
    customerID: customerLoginData.id,
    appID: appID,
    username: customerLoginData.username,
    jwtToken: jwtToken,
    loginDateTime: new Date(),
    logoutDateTime: null,
    isLogout: false,
  });

  const newlyAddedCustomerLoginObj =
    await CommonApisUtility.addNewDataToSchemaUtil({
      newSchema: newCustomerLogin,
      schemaName: "Customer Login",
    });

  if (newlyAddedCustomerLoginObj?.status === "error") {
    return {
      status: "error",
      message: "Invalid login. Login details not added to table.",
      data: {},
    };
  }
  return newlyAddedCustomerLoginObj;
};

module.exports.checkIfCustomerIsAlreadyLoggedInByCustUsernameUtil = async ({
  req,
}) => {
  const foundObjectData = await this.getCustomerLoginsByCustUsernameUtil({
    req,
  });
  let dataArray = [];
  if (foundObjectData?.status === "success") {
    dataArray = foundObjectData?.data ?? [];
  }

  const foundObject = dataArray?.find((dataObj) => !dataObj.isLogout);
  if (foundObject) {
    return {
      status: "error",
      message:
        "You are already logged in somewhere. Please logout first from the device you have last loggedin",
      data: foundObject,
    };
  }
  return {
    status: "success",
    message: "You can login",
    data: {},
  };
};

module.exports.updateCustomerLoginLogoutEntryUtil = async ({ jwtToken }) => {
  if (!jwtToken || jwtToken === "") {
    return {
      status: "error",
      message: `Jwt token is required to logout`,
      data: {},
    };
  }

  const req = { body: { jwtToken: jwtToken } };

  const foundLoggedinObject = await this.getCustomerLoginByJwtTokenUtil({
    req,
  });

  if (foundLoggedinObject?.status === "error") {
    return {
      status: "error",
      message: `You are not logged out. Error: ${foundLoggedinObject?.message}`,
      data: {},
    };
  }

  if (
    foundLoggedinObject?.status === "success" &&
    !foundLoggedinObject?.data?.isLogout
  ) {
    const newCustomerLogin = {
      jwtToken: jwtToken,
      logoutDateTime: new Date(),
      isLogout: true,
    };
    const updatedCustomerLoginSet = {
      $set: newCustomerLogin,
    };

    await CommonApisUtility.updateDataByJwtTokenInSchemaUtil({
      schema: CustomersLoginSchema,
      newDataObject: newCustomerLogin,
      updatedDataSet: updatedCustomerLoginSet,
      schemaName: "Customer Login",
      jwtToken: jwtToken,
    });
    return {
      status: "success",
      message: `You are successfully logged out.`,
      data: {},
    };
  }

  return {
    status: "error",
    message: `You are not logged out. Error: ${foundLoggedinObject?.message}`,
    data: {},
  };
};
