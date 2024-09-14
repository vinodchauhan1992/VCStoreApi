const User = require("../../model/user");
const CommonUtility = require("../../utilities/commonUtility");
const UserUtility = require("../../utilities/userUtility");

var dataObject = { status: "success", message: "", data: [] };

module.exports.getAllUser = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  User.find()
    .select(["-_id"])
    .limit(limit)
    .sort({
      id: sort,
    })
    .then((users) => {
      if (users && users.length > 0) {
        dataObject.message = "Users fetched successfully.";
        dataObject.data = users;
        dataObject.status = "success";
      } else {
        dataObject.message =
          "Users fetched successfully. But users doesn't have any data.";
        dataObject.data = [];
        dataObject.status = "success";
      }
      res.json(dataObject);
    })
    .catch((err) => {
      dataObject.message = `There is an error occurred. ${err.message}`;
      dataObject.status = "error";
      res.json(dataObject);
    });
};

module.exports.getUserByID = async (req, res) => {
  if (!req?.params?.userID || req.params.userID === "") {
    res.json({
      status: "error",
      message: "User id is required to get user by id.",
      data: {},
    });
  } else {
    const userID = req.params.userID;
    const { isSucceeded, message, data } =
      await UserUtility.checkUserExistenceByUserIDInDB({
        userID: userID,
      });
    res.json({
      status: isSucceeded ? "success" : "error",
      message: message,
      data: data,
    });
  }
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

  let userType = "Employee";
  if (req.body.userRoleID === "customer1708886695004") {
    userType = "Customer";
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
    imageData: uploadedFileData,
    userType: userType,
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
  if (req.params.userID == null) {
    res.json({
      status: "error",
      message: "User id must be provided to delete a user.",
      data: {},
    });
  } else {
    const userID = req.params.userID;

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
  if (!req?.params?.userID || req.params.userID === "") {
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
  if (!req?.body?.userRole || req.body.userRole === "") {
    res.json({
      status: "error",
      message: "User role is required.",
      data: {},
    });
    return;
  }

  const userID = req.params.userID;

  let userType = "Employee";
  if (req.body.userRoleID === "customer1708886695004") {
    userType = "Customer";
  }

  const updatedUserRoleUser = {
    id: userID,
    userRoleID: req.body.userRoleID,
    userRole: req.body.userRole,
    userType: userType,
    dateModified: new Date(),
  };

  const updatedUserRoleUserSet = {
    $set: updatedUserRoleUser,
  };

  const { isSucceeded, isUserExists, data, message } =
    await UserUtility.checkUserExistenceByUserIDInDB({ userID: userID });

  if (isUserExists && isSucceeded) {
    User.updateOne({ id: userID }, updatedUserRoleUserSet)
      .then((respondedUser) => {
        if (respondedUser && Object.keys(respondedUser).length > 0) {
          res.json({
            status: "success",
            message: `User role is updated successfully.`,
            data: data,
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
  if (!req?.params?.userID || req.params.userID === "") {
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
  if (!req?.body?.userStatus || req.body.userStatus === "") {
    res.json({
      status: "error",
      message: "User status is required.",
      data: {},
    });
    return;
  }

  const userID = req.params.userID;

  const updatedUserStatusUser = {
    id: userID,
    userStatusID: req.body.userStatusID,
    userStatus: req.body.userStatus,
    dateModified: new Date(),
  };

  const updatedUserStatusUserSet = {
    $set: updatedUserStatusUser,
  };

  const { isSucceeded, isUserExists, data, message } =
    await UserUtility.checkUserExistenceByUserIDInDB({ userID: userID });

  if (isUserExists && isSucceeded) {
    User.updateOne({ id: userID }, updatedUserStatusUserSet)
      .then((respondedUser) => {
        if (respondedUser && Object.keys(respondedUser).length > 0) {
          res.json({
            status: "success",
            message: `User status is updated successfully.`,
            data: data,
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
