const User = require("../model/user");
const {
  uploadFileToFirebaseStorage,
  deleteUploadedFileInFirebaseStorage,
  updateUploadedFileInFirebaseStorage,
} = require("./fileManagerUtility");
const CommonUtility = require("./commonUtility");

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
  if (!req?.body?.userRole || req.body.userRole === "") {
    return {
      isSucceeded: false,
      message: "User role is required.",
    };
  }
  if (!req?.body?.userStatusID || req.body.userStatusID === "") {
    return {
      isSucceeded: false,
      message: "User status id is required.",
    };
  }
  if (!req?.body?.userStatus || req.body.userStatus === "") {
    return {
      isSucceeded: false,
      message: "User status is required.",
    };
  }
  if (!req?.body?.dateOfBirth || req.body.dateOfBirth.toString() === "") {
    return {
      isSucceeded: false,
      message: "Date of birth is required.",
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
    .then((respondedUser) => {
      if (respondedUser && Object.keys(respondedUser).length > 0) {
        return {
          isUserExists: true,
          isSucceeded: true,
          isCatchError: false,
          message: `User with username '${username}' is already exists. Please use a different username.`,
          data: respondedUser,
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
    .then((respondedUser) => {
      if (respondedUser && Object.keys(respondedUser).length > 0) {
        return {
          isUserExists: true,
          isSucceeded: true,
          isCatchError: false,
          message: `User with email '${email}' is already exists. Please use a different email.`,
          data: respondedUser,
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
    .then((respondedUser) => {
      if (respondedUser && Object.keys(respondedUser).length > 0) {
        return {
          isUserExists: true,
          isSucceeded: true,
          isCatchError: false,
          message: `User with phone '${phone}' is already exists.`,
          data: respondedUser,
        };
      } else {
        return {
          isUserExists: false,
          isSucceeded: false,
          isCatchError: false,
          message: `User with phone '${phone}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        isUserExists: true,
        isSucceeded: false,
        isCatchError: true,
        message: `There is an error occurred in fetching user by phone. ${err.message}`,
        data: {},
      };
    });
};

module.exports.checkUserExistenceByUserIDInDB = async ({ userID }) => {
  return await User.findOne({
    id: userID,
  })
    .select(["-_id"])
    .then((respondedUser) => {
      if (respondedUser && Object.keys(respondedUser).length > 0) {
        return {
          isUserExists: true,
          isSucceeded: true,
          isCatchError: false,
          message: `User with userID '${userID}' is already exists.`,
          data: CommonUtility.sortObject(respondedUser),
        };
      } else {
        return {
          isUserExists: false,
          isSucceeded: false,
          isCatchError: false,
          message: `User with userID '${userID}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        isUserExists: true,
        isSucceeded: false,
        isCatchError: true,
        message: `There is an error occurred in fetching user by userID. ${err.message}`,
        data: {},
      };
    });
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
  if (checkUserExistenceByPhoneInDB.isUserExists) {
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
    .then((respondedUser) => {
      if (respondedUser && Object.keys(respondedUser).length > 0) {
        res.json({
          status: "success",
          message: `New user is added successfully.`,
          data: respondedUser,
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
  if (!req?.params?.userID || req.params.userID === "") {
    return {
      isSucceeded: false,
      message: "User id is required in url.",
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
  const { isUserExists, isSucceeded, message, data } =
    await this.checkUserExistenceByUserIDInDB({
      userID: req.body.id,
    });
  if (!isUserExists || !isSucceeded) {
    return {
      isSucceeded: false,
      message: message,
      data: data,
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
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
    },
    phone: phone,
    userRoleID: req.body.userRoleID,
    userRole: req.body.userRole,
    userStatusID: req.body.userStatusID,
    userStatus: req.body.userStatus,
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
    .then((respondedUser) => {
      if (respondedUser && Object.keys(respondedUser).length > 0) {
        res.json({
          status: "success",
          message: `User is updated successfully.`,
          data: newUser,
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
