const User = require("../../model/v3/user");
const {
  uploadFileToFirebaseStorage,
  deleteUploadedFileInFirebaseStorage,
  updateUploadedFileInFirebaseStorage,
} = require("./fileManagerUtility");
const CommonUtility = require("./commonUtility");
const CountriesUtility = require("./countriesUtility");
const StatesUtility = require("./statesUtility");
const CitiesUtility = require("./citiesUtility");
const UserRolesUtility = require("./userRolesUtility");
const UserStatusesUtility = require("./userStatusesUtility");
const GendersUtility = require("./gendersUtility");
const CommonApisUtility = require("./commonApisUtility");

module.exports.getCountryDetailsByCountryId = async ({ countryID }) => {
  const foundCountryObject = await CountriesUtility.getCountryByIdUtil({
    countryID: countryID,
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
  const foundStateObject = await StatesUtility.getStateByIdUtil({
    stateID: stateID,
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
  const foundCityObject = await CitiesUtility.getCityByIdUtil({
    cityID: cityID,
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

module.exports.getUserRoleDetailsByUserRoleId = async ({ userRoleID }) => {
  const foundUserRoleObject = await UserRolesUtility.getUserRoleByIdUtil({
    userRoleID: userRoleID,
  });
  if (
    foundUserRoleObject.status === "success" &&
    Object.keys(foundUserRoleObject?.data).length > 0
  ) {
    return foundUserRoleObject;
  }
  return {
    status: foundUserRoleObject?.status,
    message: foundUserRoleObject?.message,
    data: {
      userRoleID: userRoleID,
    },
  };
};

module.exports.getUserStatusDetailsByUserStatusId = async ({
  userStatusID,
}) => {
  const foundUserStatusObject =
    await UserStatusesUtility.getUserStatusByUserStatusIdUtil({
      userStatusID: userStatusID,
    });
  if (
    foundUserStatusObject.status === "success" &&
    Object.keys(foundUserStatusObject?.data).length > 0
  ) {
    return foundUserStatusObject;
  }
  return {
    status: foundUserStatusObject?.status,
    message: foundUserStatusObject?.message,
    data: {
      userStatusID: userStatusID,
    },
  };
};

module.exports.getAddressRelatedDetails = async ({ userData }) => {
  const countryID = userData.address.countryID;
  const foundCountryObject = await this.getCountryDetailsByCountryId({
    countryID: countryID,
  });

  const stateID = userData.address.stateID;
  const foundStateObject = await this.getStateDetailsByStateId({
    stateID: stateID,
  });

  const cityID = userData.address.cityID;
  const foundCityObject = await this.getCityDetailsByCityId({
    cityID: cityID,
  });
  return {
    countryDetails: foundCountryObject.data,
    stateDetails: foundStateObject.data,
    cityDetails: foundCityObject.data,
  };
};

module.exports.getUserRoleAndStatusRelatedDetails = async ({ userData }) => {
  const userRoleID = userData.userRoleID;
  const foundUserRoleObject = await this.getUserRoleDetailsByUserRoleId({
    userRoleID: userRoleID,
  });

  const userStatusID = userData.userStatusID;
  const foundUserStatusObject = await this.getUserStatusDetailsByUserStatusId({
    userStatusID: userStatusID,
  });

  return {
    userRoleDetails: foundUserRoleObject.data,
    userStatusDetails: foundUserStatusObject.data,
  };
};

module.exports.getGenderRelatedDetailsByGenderId = async ({ genderID }) => {
  const foundGenderObject = await GendersUtility.getGenderByIdUtil({
    req: { body: { id: genderID } },
  });
  if (
    foundGenderObject?.status === "success" &&
    Object.keys(foundGenderObject?.data).length > 0
  ) {
    return foundGenderObject;
  }
  return {
    status: foundGenderObject?.status,
    message: foundGenderObject?.message,
    data: {
      genderID: genderID && genderID !== "" ? genderID : "",
    },
  };
};

module.exports.getSingleUserWithAllDetails = async ({ userData }) => {
  const { countryDetails, stateDetails, cityDetails } =
    await this.getAddressRelatedDetails({ userData });
  const { userRoleDetails, userStatusDetails } =
    await this.getUserRoleAndStatusRelatedDetails({ userData });
  const genderDetailsObject = await this.getGenderRelatedDetailsByGenderId({
    genderID: userData?.genderID,
  });
  return {
    id: userData?.id,
    email: userData?.email,
    username: userData?.username,
    password: userData?.password,
    name: userData?.name,
    address: {
      address: userData?.address?.address,
      countryDetails: countryDetails,
      cityDetails: cityDetails,
      stateDetails: stateDetails,
      zipcode: userData?.address?.zipcode,
    },
    genderDetails: genderDetailsObject?.data,
    phone: userData?.phone,
    userRoleDetails: userRoleDetails,
    userStatusDetails: userStatusDetails,
    imageData: userData?.imageData,
    dateOfBirth: userData?.dateOfBirth,
    dateAdded: userData?.dateAdded,
    dateModified: userData?.dateModified,
  };
};

module.exports.getAllUsersWithAllDetails = async ({ allUsers }) => {
  return Promise.all(
    allUsers?.map(async (userData) => {
      const userDetails = await this.getSingleUserWithAllDetails({ userData });
      return userDetails;
    })
  );
};

module.exports.checkAddUserBodyInfoValidation = (req) => {
  if (!req?.body?.email || req.body.email === "") {
    return {
      isSucceeded: false,
      message: "Email address is required.",
    };
  }
  if (!req?.body?.username || req.body.username === "") {
    return {
      isSucceeded: false,
      message: "Username is required.",
    };
  }
  if (!req?.body?.password || req.body.password === "") {
    return {
      isSucceeded: false,
      message: "Password is required.",
    };
  }
  if (!req?.body?.firstname || req.body.firstname === "") {
    return {
      isSucceeded: false,
      message: "First name is required.",
    };
  }
  if (!req?.body?.lastname || req.body.lastname === "") {
    return {
      isSucceeded: false,
      message: "Last name is required.",
    };
  }
  if (!req?.body?.phone || req.body.phone === "") {
    return {
      isSucceeded: false,
      message: "Phone number is required.",
    };
  }
  if (!req?.body?.userRoleID || req.body.userRoleID === "") {
    return {
      isSucceeded: false,
      message: "User role id is required.",
    };
  }
  if (!req?.body?.userStatusID || req.body.userStatusID === "") {
    return {
      isSucceeded: false,
      message: "User status id is required.",
    };
  }
  if (!req?.body?.dateOfBirth || req.body.dateOfBirth.toString() === "") {
    return {
      isSucceeded: false,
      message: "Date of birth is required.",
    };
  }
  if (!req?.body?.countryID || req.body.countryID === "") {
    return {
      isSucceeded: false,
      message: "Country id is required.",
    };
  }
  if (!req?.body?.stateID || req.body.stateID === "") {
    return {
      isSucceeded: false,
      message: "State id is required.",
    };
  }
  if (!req?.body?.cityID || req.body.cityID === "") {
    return {
      isSucceeded: false,
      message: "City id is required.",
    };
  }
  if (!req?.body?.genderID || req.body.genderID === "") {
    return {
      isSucceeded: false,
      message: "Gender id is required.",
    };
  }

  return {
    isSucceeded: true,
    message: "",
  };
};

module.exports.checkUserExistenceByUsernameInDB = async ({ username }) => {
  return await User.findOne({
    username: username,
  })
    .select(["-_id"])
    .then(async (respondedUser) => {
      if (respondedUser && Object.keys(respondedUser).length > 0) {
        const fullDetailsUser = await this.getSingleUserWithAllDetails({
          userData: CommonUtility.sortObject(respondedUser),
        });
        return {
          isUserExists: true,
          isSucceeded: true,
          isCatchError: false,
          message: `User with username '${username}' is already exists. Please use a different username.`,
          data: fullDetailsUser,
        };
      } else {
        return {
          isUserExists: false,
          isSucceeded: false,
          isCatchError: false,
          message: `User with username '${username}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        isUserExists: true,
        isSucceeded: false,
        isCatchError: true,
        message: `There is an error occurred in fetching user by username. ${err.message}`,
        data: {},
      };
    });
};

module.exports.checkUserExistenceByEmailInDB = async ({ email }) => {
  return await User.findOne({
    email: email,
  })
    .select(["-_id"])
    .then(async (respondedUser) => {
      if (respondedUser && Object.keys(respondedUser).length > 0) {
        const fullDetailsUser = await this.getSingleUserWithAllDetails({
          userData: CommonUtility.sortObject(respondedUser),
        });
        return {
          isUserExists: true,
          isSucceeded: true,
          isCatchError: false,
          message: `User with email '${email}' is already exists. Please use a different email.`,
          data: fullDetailsUser,
        };
      } else {
        return {
          isUserExists: false,
          isSucceeded: false,
          isCatchError: false,
          message: `User with email '${email}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        isUserExists: true,
        isSucceeded: false,
        isCatchError: true,
        message: `There is an error occurred in fetching user by email. ${err.message}`,
        data: {},
      };
    });
};

module.exports.checkUserExistenceByPhoneInDB = async ({ phone }) => {
  return await User.findOne({
    phone: phone,
  })
    .select(["-_id"])
    .then(async (respondedUser) => {
      if (respondedUser && Object.keys(respondedUser).length > 0) {
        const fullDetailsUser = await this.getSingleUserWithAllDetails({
          userData: CommonUtility.sortObject(respondedUser),
        });
        return {
          status: "success",
          message: `User with phone '${phone}' is already exists.`,
          data: fullDetailsUser,
        };
      } else {
        return {
          status: "error",
          message: `User with phone '${phone}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in fetching user by phone. ${err.message}`,
        data: {},
      };
    });
};

module.exports.checkUserExistenceByUserIDInDB = async ({ userID }) => {
  const userByIdDataObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: User,
    schemaName: "User",
    dataID: userID,
  });
  if (userByIdDataObj?.status === "error") {
    return userByIdDataObj;
  }
  const fullUserDetails = await this.getSingleUserWithAllDetails({
    userData: userByIdDataObj?.data,
  });
  return {
    ...userByIdDataObj,
    data: fullUserDetails,
  };
};

module.exports.checkUserValidationToAddNewUser = async (req) => {
  const checkAddUserBodyInfoValidation =
    this.checkAddUserBodyInfoValidation(req);
  if (!checkAddUserBodyInfoValidation.isSucceeded) {
    return {
      status: "error",
      message: checkAddUserBodyInfoValidation.message,
      data: {},
    };
  }

  const checkUserExistenceByUsernameInDB =
    await this.checkUserExistenceByUsernameInDB({
      username: req.body.username,
    });
  if (checkUserExistenceByUsernameInDB.isUserExists) {
    return {
      status: "error",
      message: checkUserExistenceByUsernameInDB.message,
      data: {},
    };
  }

  const checkUserExistenceByEmailInDB =
    await this.checkUserExistenceByEmailInDB({ email: req.body.email });
  if (checkUserExistenceByEmailInDB.isUserExists) {
    return {
      status: "error",
      message: checkUserExistenceByEmailInDB.message,
      data: {},
    };
  }

  const checkUserExistenceByPhoneInDB =
    await this.checkUserExistenceByPhoneInDB({ phone: req.body.phone });
  if (checkUserExistenceByPhoneInDB?.status === "success") {
    return {
      status: "error",
      message: checkUserExistenceByPhoneInDB.message,
      data: {},
    };
  }
  return {
    status: "success",
    message: "User validation is succeeded.",
    data: {},
  };
};

module.exports.uploadUserImageToFS = async ({ file, userID, username }) => {
  return await uploadFileToFirebaseStorage({
    file: file,
    parentDocumentID: userID,
    parentDocumentName: username,
    imageBasePath: `images/users`,
  });
};

module.exports.deleteUploadedUserImageToFS = async ({ fileUrl }) => {
  return await deleteUploadedFileInFirebaseStorage({
    fileUrl: fileUrl,
  });
};

module.exports.addNewUserUtil = async ({ userSchema, res }) => {
  return await userSchema
    .save()
    .then(async (respondedUser) => {
      if (respondedUser && Object.keys(respondedUser).length > 0) {
        const fullDetailsUser = await this.getSingleUserWithAllDetails({
          userData: CommonUtility.sortObject(respondedUser),
        });
        res.json({
          status: "success",
          message: `New user is added successfully.`,
          data: CommonUtility.sortObject(fullDetailsUser),
        });
      } else {
        res.json({
          status: "error",
          message: `User is not added due to unknown error.`,
          data: {},
        });
      }
    })
    .catch((error) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${error.message}`,
        data: {},
      });
    });
};

module.exports.deleteUserUtil = async ({ userID, imageData, res }) => {
  return await User.deleteOne({
    id: userID,
  })
    .select(["-_id"])
    .then(async (result) => {
      if (result && result.deletedCount === 1) {
        if (imageData?.imageUrl && imageData.imageUrl !== "") {
          const deleteFileResp = await this.deleteUploadedUserImageToFS({
            fileUrl: imageData.imageUrl,
          });
          let msg = `User with user id ${userID} is deleted successfully with user image.`;
          if (!deleteFileResp.isSucceeded) {
            msg = `User with user id ${userID} is deleted successfully but user image is not deleted. FileDeletionError: ${deleteFileResp?.message}`;
          }
          res.json({
            status: "success",
            message: msg,
            data: {},
          });
        } else {
          res.json({
            status: "success",
            message: `User with user id ${userID} is deleted successfully.`,
            data: {},
          });
        }
      } else {
        res.json({
          status: "error",
          message: `User with user id ${userID} is not deleted.`,
          data: {},
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${err.message}`,
        data: {},
      });
    });
};

module.exports.checkUpdateUserInfoValidation = async (req) => {
  const responseCheck = this.checkAddUserBodyInfoValidation(req);
  if (!responseCheck.isSucceeded) {
    return {
      isSucceeded: false,
      message: responseCheck.message,
    };
  }
  if (!req?.body?.id || req.body.id === "") {
    return {
      isSucceeded: false,
      message: "Id is required in body.",
    };
  }
  if (!req?.body?.dateAdded || req.body.dateAdded === "") {
    return {
      isSucceeded: false,
      message: "Created date is required.",
    };
  }
  const foundUserObject = await this.checkUserExistenceByUserIDInDB({
    userID: req.body.id,
  });
  if (foundUserObject?.status === "error") {
    return {
      isSucceeded: false,
      message: foundUserObject?.message,
      data: foundUserObject?.data,
    };
  }
  return {
    isSucceeded: true,
    message: "",
  };
};

module.exports.updateUploadedUserImageToFS = async ({
  file,
  userID,
  username,
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
    parentDocumentID: userID,
    parentDocumentName: username,
  });
};

module.exports.updateExistingUser = async ({
  req,
  updatedUploadedFileData,
  res,
}) => {
  const userID = req.body.id;
  const username = req.body.username;
  const email = req.body.email;
  const phone = req.body.phone;
  const genderID = req.body.genderID;

  const newUser = {
    id: userID,
    email: email,
    username: username,
    password: req.body.password,
    name: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    },
    address: {
      address: req.body.address,
      countryID: req.body.countryID,
      cityID: req.body.cityID,
      stateID: req.body.stateID,
      zipcode: req.body.zipcode,
    },
    genderID: genderID,
    phone: phone,
    userRoleID: req.body.userRoleID,
    userStatusID: req.body.userStatusID,
    dateOfBirth: req.body.dateOfBirth,
    imageData: updatedUploadedFileData
      ? updatedUploadedFileData
      : finalImageData,
    dateAdded: req.body.dateAdded,
    dateModified: new Date(),
  };

  const updatedUserSet = {
    $set: newUser,
  };

  return await User.updateOne({ id: userID }, updatedUserSet)
    .then(async (respondedUser) => {
      if (respondedUser && Object.keys(respondedUser).length > 0) {
        const fullDetailsUser = await this.getSingleUserWithAllDetails({
          userData: CommonUtility.sortObject(newUser),
        });
        res.json({
          status: "success",
          message: `User is updated successfully.`,
          data: CommonUtility.sortObject(fullDetailsUser),
        });
      } else {
        res.json({
          status: "error",
          message: `User is not updated due to unknown error.`,
          data: {},
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: {},
      });
    });
};

module.exports.updateUserImageUtil = async ({ req }) => {
  const userID = req.body.id;
  const username = req.body.username;
  let finalImageData = null;
  if (req?.body?.imageData && req.body.imageData !== "") {
    const localImgData = JSON.parse(JSON.parse(req.body.imageData));
    if (localImgData && Object.keys(localImgData).length > 1) {
      finalImageData = localImgData;
    }
  }

  let updatedUploadedResponse = null;
  let updatedUploadedFileStatus = "no file added";
  let updatedUploadedFileMessage = "";
  let updatedUploadedFileData = null;
  if (req.file) {
    if (
      finalImageData &&
      Object.keys(finalImageData).length > 1 &&
      finalImageData?.fullPath &&
      finalImageData.fullPath !== "" &&
      finalImageData?.imageUrl &&
      finalImageData.imageUrl !== "" &&
      finalImageData?.name &&
      finalImageData.name !== "" &&
      finalImageData?.fileFolderName &&
      finalImageData.fileFolderName !== "" &&
      finalImageData?.fileFolderPath &&
      finalImageData.fileFolderPath !== ""
    ) {
      // updated existing image
      updatedUploadedResponse = await this.updateUploadedUserImageToFS({
        file: req.file,
        userID: userID,
        username: username,
        fullPath: finalImageData.fullPath,
        name: finalImageData.name,
        fileFolderName: finalImageData.fileFolderName,
        fileFolderPath: finalImageData.fileFolderPath,
      });
    } else {
      // add new image
      updatedUploadedResponse = await this.uploadUserImageToFS({
        file: req.file,
        userID: userID,
        username: username,
      });
    }
    updatedUploadedFileStatus = updatedUploadedResponse?.isSucceeded
      ? "success"
      : "error";
    updatedUploadedFileMessage = updatedUploadedResponse?.message;
    updatedUploadedFileData = updatedUploadedResponse?.fileData;
  }

  return {
    updatedUploadedResponse,
    updatedUploadedFileStatus,
    updatedUploadedFileMessage,
    updatedUploadedFileData,
  };
};

module.exports.updateUserUtil = async ({ req, res }) => {
  const {
    updatedUploadedFileData,
    updatedUploadedFileMessage,
    updatedUploadedFileStatus,
    updatedUploadedResponse,
  } = await this.updateUserImageUtil({ req });

  if (req.file) {
    if (updatedUploadedResponse.isSucceeded) {
      await this.updateExistingUser({
        req: req,
        updatedUploadedFileData: updatedUploadedFileData,
        res: res,
      });
    } else {
      res.json({
        status: updatedUploadedFileStatus,
        message: updatedUploadedFileMessage,
        data: updatedUploadedFileData,
      });
    }
  } else {
    await this.updateExistingUser({
      req: req,
      updatedUploadedFileData: updatedUploadedFileData,
      res: res,
    });
  }
};

module.exports.updateNameOfUserUtil = async ({ req }) => {
  if (!req?.body?.userID || req.body.userID === "") {
    return {
      status: "error",
      message: "User id is required.",
      data: {},
    };
  }
  if (!req?.body?.firstname || req.body.firstname === "") {
    return {
      status: "error",
      message: "First name is required.",
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

  const userID = req.body.userID;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;

  const foundUserObject = await this.checkUserExistenceByUserIDInDB({
    userID: userID,
  });
  if (foundUserObject?.status === "error") {
    return foundUserObject;
  }

  const newNameOfUser = {
    id: userID,
    name: {
      firstname: firstname,
      lastname: lastname,
    },
    dateModified: new Date(),
  };

  const updatedNameOfUserSet = {
    $set: newNameOfUser,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: User,
    newDataObject: newNameOfUser,
    updatedDataSet: updatedNameOfUserSet,
    schemaName: "User",
    dataID: userID,
  });
};

module.exports.updateUserDateOfBirthUtil = async ({ req }) => {
  if (!req?.body?.userID || req.body.userID === "") {
    return {
      status: "error",
      message: "User id is required.",
      data: {},
    };
  }
  if (!req?.body?.dateOfBirth || req.body.dateOfBirth === "") {
    return {
      status: "error",
      message: "Date of birth is required.",
      data: {},
    };
  }

  const userID = req.body.userID;
  const dateOfBirth = req.body.dateOfBirth;

  const foundUserObject = await this.checkUserExistenceByUserIDInDB({
    userID: userID,
  });
  if (foundUserObject?.status === "error") {
    return foundUserObject;
  }

  const newDateOfBirthOfUser = {
    id: userID,
    dateOfBirth: dateOfBirth,
    dateModified: new Date(),
  };

  const updatedDateOfBirthOfUserSet = {
    $set: newDateOfBirthOfUser,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: User,
    newDataObject: newDateOfBirthOfUser,
    updatedDataSet: updatedDateOfBirthOfUserSet,
    schemaName: "User",
    dataID: userID,
  });
};

module.exports.updateUserGenderUtil = async ({ req }) => {
  if (!req?.body?.userID || req.body.userID === "") {
    return {
      status: "error",
      message: "User id is required.",
      data: {},
    };
  }
  if (!req?.body?.genderID || req.body.genderID === "") {
    return {
      status: "error",
      message: "Gender id is required.",
      data: {},
    };
  }

  const userID = req.body.userID;
  const genderID = req.body.genderID;

  const foundUserObject = await this.checkUserExistenceByUserIDInDB({
    userID: userID,
  });
  if (foundUserObject?.status === "error") {
    return foundUserObject;
  }

  const newUserGender = {
    id: userID,
    genderID: genderID,
    dateModified: new Date(),
  };

  const updatedUserGenderSet = {
    $set: newUserGender,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: User,
    newDataObject: newUserGender,
    updatedDataSet: updatedUserGenderSet,
    schemaName: "User",
    dataID: userID,
  });
};

module.exports.updateUserPhoneUtil = async ({ req }) => {
  if (!req?.body?.userID || req.body.userID === "") {
    return {
      status: "error",
      message: "User id is required.",
      data: {},
    };
  }
  if (!req?.body?.phone || req.body.phone === "") {
    return {
      status: "error",
      message: "Phone is required.",
      data: {},
    };
  }

  const userID = req.body.userID;
  const phone = req.body.phone;

  const foundUserObject = await this.checkUserExistenceByUserIDInDB({
    userID: userID,
  });
  if (foundUserObject?.status === "error") {
    return foundUserObject;
  }

  const foundUserByPhoneObject = await this.checkUserExistenceByPhoneInDB({
    phone: phone,
  });
  if (foundUserByPhoneObject?.status === "success") {
    return {
      ...foundUserObject,
      status: "error",
      message: `Another user is already registered with the same phone number "${phone}"`,
    };
  }

  const newUserPhone = {
    id: userID,
    phone: phone,
    dateModified: new Date(),
  };

  const updatedUserPhoneSet = {
    $set: newUserPhone,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: User,
    newDataObject: newUserPhone,
    updatedDataSet: updatedUserPhoneSet,
    schemaName: "User",
    dataID: userID,
  });
};

module.exports.updateUserAddressUtil = async ({ req }) => {
  if (!req?.body?.userID || req.body.userID === "") {
    return {
      status: "error",
      message: "User id is required.",
      data: {},
    };
  }
  if (!req?.body?.address || req.body.address === "") {
    return {
      status: "error",
      message: "Address is required.",
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
  if (!req?.body?.zipcode || req.body.zipcode === "") {
    return {
      status: "error",
      message: "Zipcode is required.",
      data: {},
    };
  }

  const userID = req.body.userID;
  const address = req.body.address;
  const countryID = req.body.countryID;
  const stateID = req.body.stateID;
  const cityID = req.body.cityID;
  const zipcode = req.body.zipcode;

  const foundUserObject = await this.checkUserExistenceByUserIDInDB({
    userID: userID,
  });
  if (foundUserObject?.status === "error") {
    return foundUserObject;
  }

  const newUserAddress = {
    id: userID,
    address: {
      address: address,
      countryID: countryID,
      cityID: cityID,
      stateID: stateID,
      zipcode: zipcode,
    },
    dateModified: new Date(),
  };

  const updatedUserAddressSet = {
    $set: newUserAddress,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: User,
    newDataObject: newUserAddress,
    updatedDataSet: updatedUserAddressSet,
    schemaName: "User",
    dataID: userID,
  });
};

module.exports.updateUserPhotoUtil = async ({ req }) => {
  if (!req?.file) {
    return {
      status: "error",
      message: "File is required.",
      data: {},
    };
  }
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "User id is required.",
      data: {},
    };
  }
  if (!req?.body?.username || req.body.username === "") {
    return {
      status: "error",
      message: "Username is required.",
      data: {},
    };
  }
  const userID = req.body.id;

  const foundUserObject = await this.checkUserExistenceByUserIDInDB({
    userID: userID,
  });
  if (foundUserObject?.status === "error") {
    return foundUserObject;
  }

  const updatedRequestBody = {
    ...req.body,
    imageData: foundUserObject?.data?.imageData
      ? JSON.stringify(JSON.stringify(foundUserObject.data.imageData))
      : req?.body?.imageData,
  };

  const updatedRequest = {
    ...req,
    body: {
      ...updatedRequestBody,
    },
  };

  const {
    updatedUploadedFileData,
    updatedUploadedFileMessage,
    updatedUploadedFileStatus,
    updatedUploadedResponse,
  } = await this.updateUserImageUtil({ req: updatedRequest });

  if (!updatedUploadedResponse?.isSucceeded) {
    return {
      status: updatedUploadedFileStatus,
      message: updatedUploadedFileMessage
        ? updatedUploadedFileMessage
        : "User photo cannot be uploaded due to an unknown error.",
      data: updatedUploadedFileData ? updatedUploadedFileData : {},
    };
  }

  const newUserPhoto = {
    id: userID,
    imageData: updatedUploadedFileData,
    dateModified: new Date(),
  };

  const updatedUserPhotoSet = {
    $set: newUserPhoto,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: User,
    newDataObject: newUserPhoto,
    updatedDataSet: updatedUserPhotoSet,
    schemaName: "User",
    dataID: userID,
  });
};

module.exports.updateUserRoleUtil = async ({ req }) => {
  if (!req?.body?.userID || req.body.userID === "") {
    return {
      status: "error",
      message: "User id is required.",
      data: {},
    };
  }
  if (!req?.body?.userRoleID || req.body.userRoleID === "") {
    return {
      status: "error",
      message: "User role id is required.",
      data: {},
    };
  }

  const userID = req.body.userID;
  const userRoleID = req.body.userRoleID;

  const foundUserObject = await this.checkUserExistenceByUserIDInDB({
    userID: userID,
  });
  if (foundUserObject?.status === "error") {
    return foundUserObject;
  }

  const foundUserRoleObject = await UserRolesUtility.getUserRoleByIdUtil({
    userRoleID: userRoleID,
  });
  if (foundUserRoleObject?.status === "error") {
    return {
      ...foundUserRoleObject,
      message: `Role of user cannot be updated. ${foundUserRoleObject?.message}`,
    };
  }

  const updatedUserRoleUser = {
    id: userID,
    userRoleID: userRoleID,
    dateModified: new Date(),
  };

  const updatedUserRoleUserSet = {
    $set: updatedUserRoleUser,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: User,
    newDataObject: updatedUserRoleUser,
    updatedDataSet: updatedUserRoleUserSet,
    schemaName: "User",
    dataID: userID,
  });
};

module.exports.updateUserStatusUtil = async ({ req }) => {
  if (!req?.body?.userID || req.body.userID === "") {
    return {
      status: "error",
      message: "User id is required.",
      data: {},
    };
  }
  if (!req?.body?.userStatusID || req.body.userStatusID === "") {
    return {
      status: "error",
      message: "User status id is required.",
      data: {},
    };
  }

  const userID = req.body.userID;
  const userStatusID = req.body.userStatusID;

  const foundUserObject = await this.checkUserExistenceByUserIDInDB({
    userID: userID,
  });
  if (foundUserObject?.status === "error") {
    return foundUserObject;
  }

  const foundUserStatusObject =
    await UserStatusesUtility.getUserStatusByUserStatusIdUtil({
      userStatusID: userStatusID,
    });
  if (foundUserStatusObject?.status === "error") {
    return {
      ...foundUserStatusObject,
      message: `Status of user cannot be updated. ${foundUserStatusObject?.message}`,
    };
  }

  const updatedUserStatusUser = {
    id: userID,
    userStatusID: userStatusID,
    dateModified: new Date(),
  };

  const updatedUserStatusUserSet = {
    $set: updatedUserStatusUser,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: User,
    newDataObject: updatedUserStatusUser,
    updatedDataSet: updatedUserStatusUserSet,
    schemaName: "User",
    dataID: userID,
  });
};
