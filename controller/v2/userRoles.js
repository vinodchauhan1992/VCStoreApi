const UserRoles = require("../../model/userRoles");
const CommonUtility = require("../../utilities/commonUtility");

let dataObject = { status: "success", message: "", data: [] };

module.exports.getAllUserRoles = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  UserRoles.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((userRolesData) => {
      if (userRolesData && userRolesData.length > 0) {
        res.json({
          status: "success",
          message: "User roles fetched successfully.",
          data: CommonUtility.sortObjectsOfArray(userRolesData),
        });
      } else {
        res.json({
          status: "success",
          message:
            "User roles fetched successfully. But user roles doesn't have any data.",
          data: [],
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: [],
      });
    });
};

module.exports.getUserRoleByID = (req, res) => {
  if (!req?.params?.userRoleID || req.params.userRoleID === "") {
    dataObject.status = "error";
    dataObject.message = "User role id should be provided";
    res.json(dataObject);
  } else {
    const userRoleID = req.params.userRoleID;

    UserRoles.findOne({
      id: userRoleID,
    })
      .select(["-_id"])
      .then((userRole) => {
        if (userRole && Object.keys(userRole).length > 0) {
          res.json({
            status: "success",
            message: `User role with userRoleID ${userRoleID} fetched successfully.`,
            data: CommonUtility.sortObject(userRole),
          });
        } else {
          res.json({
            status: "error",
            message: `There is no user role exists with userRoleID ${userRoleID}.`,
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
  }
};

module.exports.addUserRole = (req, res) => {
  if (typeof req.body == undefined) {
    dataObject.status = "error";
    dataObject.message = "Please send all required data to add a user role.";
    dataObject.data = {};
    res.json(dataObject);
  } else {
    const userRole = new UserRoles({
      id: CommonUtility.getUniqueID(),
      role: req.body.role,
      description: req.body.description,
      dateAdded: new Date(),
      dateModified: new Date(),
    });

    userRole
      .save()
      .then((respondedUserRole) => {
        if (respondedUserRole && Object.keys(respondedUserRole).length > 0) {
          dataObject.status = "success";
          dataObject.message = `New user role is added successfully.`;
          dataObject.data = respondedUserRole;
        } else {
          dataObject.status = "error";
          dataObject.message = `User role is not added due to unknown error.`;
          dataObject.data = {};
        }
        res.json(dataObject);
      })
      .catch((err) => {
        dataObject.status = "error";
        dataObject.message = `There is an error occurred. ${err}`;
        dataObject.data = {};
        res.json(dataObject);
      });
  }
};

module.exports.deleteUserRole = (req, res) => {
  if (req.params.userRoleID == null) {
    dataObject.status = "error";
    dataObject.message = "User role id must be provided to delete a user role.";
    dataObject.data = {};
    res.json(dataObject);
  } else {
    const userRoleID = req.params.userRoleID;
    UserRoles.deleteOne({
      id: userRoleID,
    })
      .select(["-_id"])
      .then((result) => {
        if (result && result.deletedCount === 1) {
          dataObject.status = "success";
          dataObject.message = `User role with user role id ${userRoleID} is deleted successfully.`;
          dataObject.data = {};
        } else {
          dataObject.status = "error";
          dataObject.message = `User role with user role id ${userRoleID} is not deleted.`;
          dataObject.data = {};
        }
        res.json(dataObject);
      })
      .catch((err) => {
        dataObject.status = "error";
        dataObject.message = `There is an error occurred. ${err}`;
        dataObject.data = {};
        res.json(dataObject);
      });
  }
};
