const UserRoles = require("../../model/v3/userRoles");
const CommonUtility = require("../../utilities/v3/commonUtility");
const UserRolesUtility = require("../../utilities/v3/userRolesUtility");

module.exports.getAllUserRoles = (req, res) => {
  const limit = req?.body?.limit ? Number(req.body.limit) : 0;
  const sort = req?.body?.sort == "desc" ? -1 : 1;

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

module.exports.getUserRoleByID = async (req, res) => {
  if (!req?.body?.userRoleID || req.body.userRoleID === "") {
    res.json({
      status: "error",
      message: "User role id is required",
      data: {},
    });
    return;
  }

  try {
    const userRoleID = req.body.userRoleID;
    const foundResponseObj = await UserRolesUtility.getUserRoleByIdUtil({
      userRoleID,
    });
    res.json(foundResponseObj);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in getUserRoleByID function in userRoles controller. ${error.message}`,
      data: {},
    });
  }
};

module.exports.addUserRole = async (req, res) => {
  if (!req.body.role || req.body.role === "") {
    res.json({
      status: "error",
      message: "Role is required.",
      data: {},
    });
    return;
  }
  if (!req.body.description || req.body.description === "") {
    res.json({
      status: "error",
      message: "Description is required.",
      data: {},
    });
    return;
  }

  try {
    const userRole = req.body.role;
    const foundResponseObj = await UserRolesUtility.getUserRoleByRoleUtil({
      userRole,
    });
    if (foundResponseObj?.status === "error") {
      UserRolesUtility.addUserRoleUtil({ req, res });
    } else {
      res.json(foundResponseObj);
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in addUserRole function in userRoles controller. ${error.message}`,
      data: {},
    });
  }
};

module.exports.deleteUserRole = async (req, res) => {
  if (!req?.body?.userRoleID || req.body.userRoleID === "") {
    res.json({
      status: "error",
      message: "User role id is required.",
      data: {},
    });
    return;
  }

  try {
    const userRoleID = req.body.userRoleID;
    const foundResponseObj = await UserRolesUtility.getUserRoleByIdUtil({
      userRoleID,
    });

    if (foundResponseObj?.status === "success") {
      await UserRolesUtility.deleteUserRoleUtil({ req, res });
    } else {
      res.json(foundResponseObj);
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in deleteUserRole function when fetching user role by id in userRoles controller. ${error.message}`,
      data: {},
    });
  }
};

module.exports.updateUserRole = async (req, res) => {
  if (!req?.body?.id || req.body.id === "") {
    res.json({
      status: "error",
      message: "Id is required",
      data: {},
    });
    return;
  }
  if (!req?.body?.role || req.body.role === "") {
    res.json({
      status: "error",
      message: "Role is required",
      data: {},
    });
    return;
  }
  if (!req?.body?.description || req.body.description === "") {
    res.json({
      status: "error",
      message: "Description is required",
      data: {},
    });
    return;
  }

  try {
    const userRoleID = req.body.id;
    const foundResponseObj = await UserRolesUtility.getUserRoleByIdUtil({
      userRoleID,
    });

    if (foundResponseObj?.status === "success") {
      await UserRolesUtility.updateUserRoleUtil({ req, res });
    } else {
      res.json(foundResponseObj);
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in updateUserRole function when fetching user role by id in userRoles controller. ${error.message}`,
      data: {},
    });
  }
};

module.exports.getUserRoleByRole = async (req, res) => {
  if (!req?.body?.userRole || req.body.userRole === "") {
    res.json({
      status: "error",
      message: "User role is required",
      data: {},
    });
    return;
  }

  try {
    const userRole = req.body.userRole;
    const foundResponseObj = await UserRolesUtility.getUserRoleByRoleUtil({
      userRole,
    });
    res.json(foundResponseObj);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in getUserRoleByRole function in userRoles controller. ${error.message}`,
      data: {},
    });
  }
};
