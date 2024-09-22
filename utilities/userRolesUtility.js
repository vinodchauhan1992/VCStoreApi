const UserRoles = require("../model/userRoles");
const CommonUtility = require("./commonUtility");

module.exports.getUserRoleByIdUtil = async ({ userRoleID }) => {
  return await UserRoles.findOne({
    id: userRoleID,
  })
    .select(["-_id"])
    .then((userRole) => {
      if (userRole && Object.keys(userRole).length > 0) {
        return {
          status: "success",
          message: `User role with userRoleID ${userRoleID} fetched successfully.`,
          data: CommonUtility.sortObject(userRole),
        };
      } else {
        return {
          status: "error",
          message: `There is no user role exists with userRoleID ${userRoleID}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: {},
      };
    });
};

module.exports.getUserRoleByRoleUtil = async ({ userRole }) => {
  return await UserRoles.findOne({
    role: userRole,
  })
    .select(["-_id"])
    .then((userRoleData) => {
      if (userRoleData && Object.keys(userRoleData).length > 0) {
        return {
          status: "success",
          message: `User role with user role ${userRole} fetched successfully.`,
          data: CommonUtility.sortObject(userRoleData),
        };
      } else {
        return {
          status: "error",
          message: `There is no user role exists with user role ${userRole}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: {},
      };
    });
};

module.exports.updateUserRoleUtil = async ({ req, res }) => {
  const roleID = req.body.id;
  const role = req.body.role;
  const userType = req.body.userType;
  const description = req.body.description;
  const dateAdded = req.body.dateAdded;
  const newUserRole = {
    id: roleID,
    role: role,
    userType: userType,
    description: description,
    dateAdded: dateAdded,
    dateModified: new Date(),
  };

  const updatedUserRoleSet = {
    $set: newUserRole,
  };

  return await UserRoles.updateOne({ id: roleID }, updatedUserRoleSet)
    .then((respondedUserRoleObject) => {
      if (
        respondedUserRoleObject &&
        Object.keys(respondedUserRoleObject).length > 0
      ) {
        res.json({
          status: "success",
          message: `User role is updated successfully.`,
          data: newUserRole,
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
        message: `There is an error occurred. ${err.message}`,
        data: {},
      });
    });
};

module.exports.deleteUserRoleUtil = async ({ req, res }) => {
  const userRoleID = req.params.userRoleID;
  UserRoles.deleteOne({
    id: userRoleID,
  })
    .select(["-_id"])
    .then((result) => {
      if (result && result.deletedCount === 1) {
        res.json({
          status: "success",
          message: `User role with user role id ${userRoleID} is deleted successfully.`,
          data: {},
        });
      } else {
        res.json({
          status: "error",
          message: `User role with user role id ${userRoleID} is not deleted.`,
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

module.exports.addUserRoleUtil = async ({ req, res }) => {
  const userRole = new UserRoles({
    id: CommonUtility.getUniqueID(),
    role: req.body.role,
    userType: req.body.userType,
    description: req.body.description,
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  userRole
    .save()
    .then((respondedUserRole) => {
      if (respondedUserRole && Object.keys(respondedUserRole).length > 0) {
        res.json({
          status: "success",
          message: `New user role is added successfully.`,
          data: respondedUserRole,
        });
      } else {
        res.json({
          status: "error",
          message: `User role is not added due to unknown error.`,
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
