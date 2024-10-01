const UserStatuses = require("../../model/v3/userStatuses");
const UserStatusesUtility = require("../../utilities/v3/userStatusesUtility");

module.exports.getAllUserStatuses = async (req, res) => {
  try {
    const foundDataObject = await UserStatusesUtility.getAllUserStatusesUtil({
      req,
    });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred in catch block in getAllUserStatuses function. ${err.message}`,
      data: [],
    });
  }
};

module.exports.getUserStatusByID = async (req, res) => {
  if (!req?.body?.userStatusID || req.body.userStatusID === "") {
    res.json({
      status: "error",
      message: "User status id is required",
      data: {},
    });
    return;
  }

  const userStatusID = req.body.userStatusID;

  try {
    const foundDataObject =
      await UserStatusesUtility.getUserStatusByUserStatusIdUtil({
        userStatusID,
      });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred in catch block in getUserStatusByID function. ${error.message}`,
      data: {},
    });
  }
};

module.exports.addUserStatus = (req, res) => {
  if (!req?.body?.status || req.body.status === "") {
    res.json({
      status: "error",
      message: "Status is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.description || req.body.description === "") {
    res.json({
      status: "error",
      message: "Description is required.",
      data: {},
    });
    return;
  }

  try {
    UserStatusesUtility.addNewUserUtil({ req, res });
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred in addUserStatus function. ${error.message}`,
      data: {},
    });
  }
};

module.exports.deleteUserStatus = (req, res) => {
  if (!req?.body?.userStatusID || req.body.userStatusID === "") {
    res.json({
      status: "error",
      message: "User status id must be provided to delete a user status.",
      data: {},
    });
    return;
  }

  const userStatusID = req.body.userStatusID;
  UserStatuses.deleteOne({
    id: userStatusID,
  })
    .select(["-_id"])
    .then((result) => {
      if (result && result.deletedCount === 1) {
        res.json({
          status: "success",
          message: `User status with user status id ${userStatusID} is deleted successfully.`,
          data: {},
        });
      } else {
        res.json({
          status: "error",
          message: `User status with user status id ${userStatusID} is not deleted.`,
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
