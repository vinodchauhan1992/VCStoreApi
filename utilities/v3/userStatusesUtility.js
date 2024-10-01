const CommonUtility = require("./commonUtility");
const UserStatuses = require("../../model/v3/userStatuses");

module.exports.getAllUserStatusesUtil = async ({ req }) => {
  const limit = req?.body?.limit ? Number(req.body.limit) : 0;
  const sort = req?.body?.sort == "desc" ? -1 : 1;

  return await UserStatuses.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((userStatusesData) => {
      if (userStatusesData && userStatusesData.length > 0) {
        return {
          status: "success",
          message: "User statuses fetched successfully.",
          data: CommonUtility.sortObjectsOfArray(userStatusesData),
        };
      } else {
        return {
          status: "success",
          message:
            "User statuses fetched successfully. But user statuses doesn't have any data.",
          data: [],
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getAllUserStatusesUtil function. ${err.message}`,
        data: [],
      };
    });
};

module.exports.getUserStatusByUserStatusIdUtil = async ({ userStatusID }) => {
  return await UserStatuses.findOne({
    id: userStatusID,
  })
    .select(["-_id"])
    .then((userStatus) => {
      if (userStatus && Object.keys(userStatus).length > 0) {
        return {
          status: "success",
          message: `User status with userStatusID ${userStatusID} fetched successfully.`,
          data: CommonUtility.sortObject(userStatus),
        };
      } else {
        return {
          status: "error",
          message: `There is no user status exists with userStatusID ${userStatusID}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred. ${err.message}`,
        data: {},
      };
    });
};

module.exports.addNewUserUtil = async ({ req, res }) => {
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
      if (respondedUserStatus && Object.keys(respondedUserStatus).length > 0) {
        res.json({
          status: "success",
          message: `New user status is added successfully.`,
          data: respondedUserStatus,
        });
      } else {
        res.json({
          status: "error",
          message: `User status is not added due to unknown error.`,
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
