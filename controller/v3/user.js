const User = require("../../model/v3/user");
const CommonUtility = require("../../utilities/v3/commonUtility");
const UserUtility = require("../../utilities/v3/userUtility");

module.exports.getAllUser = async (req, res) => {
  const limit = req?.body?.limit ? Number(req.body.limit) : 0;
  const sort = req.body.sort == "desc" ? -1 : 1;

  User.find()
    .select(["-_id"])
    .limit(limit)
    .sort({
      id: sort,
    })
    .then(async (users) => {
      const fullDetailsUsers = await UserUtility.getAllUsersWithAllDetails({
        allUsers: CommonUtility.sortObjectsOfArray(users),
      });
      if (users && users.length > 0) {
        res.json({
          status: "success",
          message: "Users fetched successfully.",
          data: fullDetailsUsers,
        });
      } else {
        res.json({
          status: "success",
          message:
            "Users fetched successfully. But users doesn't have any data.",
          data: [],
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${err.message}`,
        data: [],
      });
    });
};

module.exports.getUserByID = async (req, res) => {
  if (!req?.body?.userID || req.body.userID === "") {
    res.json({
      status: "error",
      message: "User id is required to get user by id.",
      data: {},
    });
    return;
  }
  const userID = req.body.userID;
  const { isSucceeded, message, data } =
    await UserUtility.checkUserExistenceByUserIDInDB({
      userID: userID,
    });
  res.json({
    status: isSucceeded ? "success" : "error",
    message: message,
    data: data,
  });
};

module.exports.addNewUser = async (req, res) => {
  const checkUserValidationToAddNewUserResponse =
    await UserUtility.checkUserValidationToAddNewUser(req);
  if (checkUserValidationToAddNewUserResponse.status === "error") {
    res.json(checkUserValidationToAddNewUserResponse);
    return;
  }

  const userID = CommonUtility.getUniqueID();
  const username = req.body.username;
  const email = req.body.email;
  const phone = req.body.phone;
  const genderID = req.body.genderID;
  
  let uploadResponse = null;
  let uploadedFileStatus = "no file added";
  let uploadedFileMessage = "";
  let uploadedFileData = {};
  if (req.file) {
    uploadResponse = await UserUtility.uploadUserImageToFS({
      file: req.file,
      userID: userID,
      username: username,
    });

    uploadedFileStatus = uploadResponse?.isSucceeded ? "success" : "error";
    uploadedFileMessage = uploadResponse?.message;
    uploadedFileData = uploadResponse?.fileData;
  }

  const user = new User({
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
    imageData: uploadedFileData,
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  if (req.file) {
    if (uploadResponse.isSucceeded) {
      await UserUtility.addNewUserUtil({
        userSchema: user,
        res: res,
      });
    } else {
      res.json({
        status: uploadedFileStatus,
        message: uploadedFileMessage,
        data: uploadedFileData,
      });
    }
  } else {
    await UserUtility.addNewUserUtil({
      userSchema: user,
      res: res,
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!req?.body?.userID || req.body.userID === "") {
    res.json({
      status: "error",
      message: "User id is required.",
      data: {},
    });
    return;
  }
  const userID = req.body.userID;

  const { isSucceeded, isUserExists, isCatchError, message, data } =
    await UserUtility.checkUserExistenceByUserIDInDB({
      userID: userID,
    });

  if (isUserExists && isSucceeded) {
    await UserUtility.deleteUserUtil({
      userID: userID,
      imageData: data?.imageData ?? null,
      res: res,
    });
  } else {
    res.json({
      status: isSucceeded ? "success" : "error",
      message: message,
      data: data,
    });
  }
};

module.exports.updateUser = async (req, res) => {
  const checkUpdateUserInfoValidation =
    await UserUtility.checkUpdateUserInfoValidation(req);
  if (!checkUpdateUserInfoValidation.isSucceeded) {
    res.json({
      status: "error",
      message: checkUpdateUserInfoValidation.message,
      data: {},
    });
    return;
  }

  await UserUtility.updateUserUtil({ req, res });
};

module.exports.updateUserRole = async (req, res) => {
  if (!req?.body?.userID || req.body.userID === "") {
    res.json({
      status: "error",
      message: "User id is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.userRoleID || req.body.userRoleID === "") {
    res.json({
      status: "error",
      message: "User role id is required.",
      data: {},
    });
    return;
  }

  const userID = req.body.userID;

  const updatedUserRoleUser = {
    id: userID,
    userRoleID: req.body.userRoleID,
    dateModified: new Date(),
  };

  const updatedUserRoleUserSet = {
    $set: updatedUserRoleUser,
  };

  const { isSucceeded, isUserExists, data, message } =
    await UserUtility.checkUserExistenceByUserIDInDB({ userID: userID });

  if (isUserExists && isSucceeded) {
    User.updateOne({ id: userID }, updatedUserRoleUserSet)
      .then(async (respondedUser) => {
        if (respondedUser && Object.keys(respondedUser).length > 0) {
          res.json({
            status: "success",
            message: `User role is updated successfully.`,
            data: CommonUtility.sortObject(data),
          });
        } else {
          res.json({
            status: "error",
            message: `User role is not updated due to unknown error.`,
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
  } else {
    res.json({
      status: "error",
      message: message,
      data: {},
    });
  }
};

module.exports.updateUserStatus = async (req, res) => {
  if (!req?.body?.userID || req.body.userID === "") {
    res.json({
      status: "error",
      message: "User id is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.userStatusID || req.body.userStatusID === "") {
    res.json({
      status: "error",
      message: "User status id is required.",
      data: {},
    });
    return;
  }

  const userID = req.body.userID;

  const updatedUserStatusUser = {
    id: userID,
    userStatusID: req.body.userStatusID,
    dateModified: new Date(),
  };

  const updatedUserStatusUserSet = {
    $set: updatedUserStatusUser,
  };

  const { isSucceeded, isUserExists, data, message } =
    await UserUtility.checkUserExistenceByUserIDInDB({ userID: userID });

  if (isUserExists && isSucceeded) {
    User.updateOne({ id: userID }, updatedUserStatusUserSet)
      .then(async (respondedUser) => {
        if (respondedUser && Object.keys(respondedUser).length > 0) {
          res.json({
            status: "success",
            message: `User status is updated successfully.`,
            data: CommonUtility.sortObject(data),
          });
        } else {
          res.json({
            status: "error",
            message: `User status is not updated due to unknown error.`,
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
  } else {
    res.json({
      status: "error",
      message: message,
      data: {},
    });
  }
};

module.exports.changeUserPassword = async (req, res) => {};

module.exports.getUserByUsername = async (req, res) => {
  if (!req?.body?.username || req.body.username === "") {
    res.json({
      status: "error",
      message: "Username is required.",
      data: {},
    });
    return;
  }

  const username = req.body.username;

  const { isUserExists, isSucceeded, data } =
    await UserUtility.checkUserExistenceByUsernameInDB({ username });

  res.json({
    status: isSucceeded && isUserExists ? "success" : "error",
    message:
      isSucceeded && isUserExists
        ? `User found successfully by username ${username}`
        : `User not found by username ${username}`,
    data: data && Object.keys(data) ? data : {},
  });
};

module.exports.getUserByEmail = async (req, res) => {
  if (!req?.body?.email || req.body.email === "") {
    res.json({
      status: "error",
      message: "Email is required.",
      data: {},
    });
    return;
  }

  const email = req.body.email;

  const { isUserExists, isSucceeded, data } =
    await UserUtility.checkUserExistenceByEmailInDB({ email });

  res.json({
    status: isSucceeded && isUserExists ? "success" : "error",
    message:
      isSucceeded && isUserExists
        ? `User found successfully by email ${email}`
        : `User not found by email ${email}`,
    data: data && Object.keys(data) ? data : {},
  });
};

module.exports.getUserByPhone = async (req, res) => {
  if (!req?.body?.phone || req.body.phone === "") {
    res.json({
      status: "error",
      message: "Phone is required.",
      data: {},
    });
    return;
  }

  const phone = req.body.phone;

  const { isUserExists, isSucceeded, data } =
    await UserUtility.checkUserExistenceByPhoneInDB({ phone });

  res.json({
    status: isSucceeded && isUserExists ? "success" : "error",
    message:
      isSucceeded && isUserExists
        ? `User found successfully by phone ${phone}`
        : `User not found by phone ${phone}`,
    data: data && Object.keys(data) ? data : {},
  });
};
