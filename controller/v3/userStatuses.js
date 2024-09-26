const UserStatuses = require("../../model/v3/userStatuses");
const CommonUtility = require("../../utilities/v3/commonUtility");

let dataObject = { status: "success", message: "", data: [] };

module.exports.getAllUserStatuses = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  UserStatuses.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((userStatusesData) => {
      if (userStatusesData && userStatusesData.length > 0) {
        res.json({
          status: "success",
          message: "User statuses fetched successfully.",
          data: CommonUtility.sortObjectsOfArray(userStatusesData),
        });
      } else {
        res.json({
          status: "success",
          message:
            "User statuses fetched successfully. But user statuses doesn't have any data.",
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

module.exports.getUserStatusByID = (req, res) => {
  if (!req?.params?.userStatusID || req.params.userStatusID === "") {
    dataObject.status = "error";
    dataObject.message = "User status id should be provided";
    res.json(dataObject);
  } else {
    const userStatusID = req.params.userStatusID;

    UserStatuses.findOne({
      id: userStatusID,
    })
      .select(["-_id"])
      .then((userStatus) => {
        if (userStatus && Object.keys(userStatus).length > 0) {
          res.json({
            status: "success",
            message: `User status with userStatusID ${userStatusID} fetched successfully.`,
            data: CommonUtility.sortObject(userStatus),
          });
        } else {
          res.json({
            status: "error",
            message: `There is no user status exists with userStatusID ${userStatusID}.`,
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

module.exports.addUserStatus = (req, res) => {
  if (typeof req.body == undefined) {
    dataObject.status = "error";
    dataObject.message = "Please send all required data to add a user status.";
    dataObject.data = {};
    res.json(dataObject);
  } else {
    const userStatus = new UserStatuses({
      id: CommonUtility.getUniqueID(),
      status: req.body.status,
      description: req.body.description,
      dateAdded: new Date(),
      dateModified: new Date(),
    });

    userStatus
      .save()
      .then((respondedUserStatus) => {
        if (
          respondedUserStatus &&
          Object.keys(respondedUserStatus).length > 0
        ) {
          dataObject.status = "success";
          dataObject.message = `New user status is added successfully.`;
          dataObject.data = respondedUserStatus;
        } else {
          dataObject.status = "error";
          dataObject.message = `User status is not added due to unknown error.`;
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

module.exports.deleteUserStatus = (req, res) => {
  if (req.params.userStatusID == null) {
    dataObject.status = "error";
    dataObject.message =
      "User status id must be provided to delete a user status.";
    dataObject.data = {};
    res.json(dataObject);
  } else {
    const userStatusID = req.params.userStatusID;
    UserStatuses.deleteOne({
      id: userStatusID,
    })
      .select(["-_id"])
      .then((result) => {
        if (result && result.deletedCount === 1) {
          dataObject.status = "success";
          dataObject.message = `User status with user status id ${userStatusID} is deleted successfully.`;
          dataObject.data = {};
        } else {
          dataObject.status = "error";
          dataObject.message = `User status with user status id ${userStatusID} is not deleted.`;
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
