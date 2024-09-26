const UserDropdownMenu = require("../../model/v3/userDropdownMenu");
const { sortObject, sortObjectsOfArray } = require("./commonUtility");

module.exports.getAllUserDropdownMenusUtil = async ({ req }) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  return await UserDropdownMenu.find()
    .select(["-_id"])
    .limit(limit)
    .sort({
      id: sort,
    })
    .then((userDropdownMenus) => {
      if (userDropdownMenus && userDropdownMenus.length > 0) {
        userDropdownMenus.sort((a, b) => {
          return a.priority - b.priority;
        });
        return {
          status: "success",
          message: "User dropdown menus fetched successfully.",
          data: sortObjectsOfArray(userDropdownMenus),
        };
      } else {
        return {
          status: "error",
          message:
            "User dropdown menus fetched successfully. But user dropdown menu doesn't have any data.",
          data: [],
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred. ${err.message}`,
        data: [],
      };
    });
};

module.exports.getUserDropdownMenuByIdUtil = async ({ userDropdownMenuID }) => {
  return await UserDropdownMenu.findOne({
    id: userDropdownMenuID,
  })
    .select(["-_id"])
    .then((respondedUserDropdownMenuData) => {
      if (
        respondedUserDropdownMenuData &&
        Object.keys(respondedUserDropdownMenuData).length > 0
      ) {
        return {
          status: "success",
          message: `User dropdown menu with user dropdown menu ID '${userDropdownMenuID}' is already exists.`,
          data: sortObject(respondedUserDropdownMenuData),
        };
      } else {
        return {
          status: "error",
          message: `User dropdown menu with user dropdown menu ID '${userDropdownMenuID}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in fetching user dropdown menu by user dropdown menu ID. ${err.message}`,
        data: {},
      };
    });
};

module.exports.getAllUserDropdownMenusPrioritiesUtil = ({
  allUserDropdownMenusObject,
}) => {
  const userDropdownMenusArray = allUserDropdownMenusObject.data;

  const priorities = [];
  userDropdownMenusArray.map((uerDropdownMenuData) => {
    priorities.push(uerDropdownMenuData.priority);
  });

  return priorities;
};

module.exports.getUserDropdownMenuDataByPriorityInDbUtil = async ({
  priority,
}) => {
  return await UserDropdownMenu.findOne({
    priority: priority,
  })
    .select(["-_id"])
    .then((respondedUserDropdownMenuObject) => {
      if (
        respondedUserDropdownMenuObject &&
        Object.keys(respondedUserDropdownMenuObject).length > 0
      ) {
        return {
          status: "success",
          message: `User dropdown menu with priority '${priority}' is already exists. Please use a different priority.`,
          data: sortObject(respondedUserDropdownMenuObject),
        };
      } else {
        return {
          status: "error",
          message: `User dropdown menu with priority '${priority}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in fetching admin menu by priority. ${err.message}`,
        data: {},
      };
    });
};

module.exports.getUserDropdownMenuDataByTitleInDbUtil = async ({
  userDropdownMenuTitle,
}) => {
  return await UserDropdownMenu.findOne({
    title: userDropdownMenuTitle,
  })
    .select(["-_id"])
    .then((respondedUserDropdownMenuObject) => {
      if (
        respondedUserDropdownMenuObject &&
        Object.keys(respondedUserDropdownMenuObject).length > 0
      ) {
        return {
          status: "success",
          message: `User dropdown menu with title '${userDropdownMenuTitle}' is already exists. Please use a different title.`,
          data: respondedUserDropdownMenuObject,
        };
      } else {
        return {
          status: "error",
          message: `User dropdown menu with title '${userDropdownMenuTitle}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in fetching user dropdown menu by title. ${err.message}`,
        data: {},
      };
    });
};

module.exports.addNewUserDropdownMenuUtil = async ({
  userDropdownMenuSchema,
  res,
}) => {
  userDropdownMenuSchema
    .save()
    .then((respondedUserDropdownMenuObject) => {
      if (
        respondedUserDropdownMenuObject &&
        Object.keys(respondedUserDropdownMenuObject).length > 0
      ) {
        res.json({
          status: "success",
          message: `New user dropdown menu data is added successfully.`,
          data: sortObject(respondedUserDropdownMenuObject),
        });
      } else {
        res.json({
          status: "error",
          message: `User dropdown menu data is not added due to unknown error.`,
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

module.exports.deleteUserDropdownMenuDataUtil = async ({
  res,
  userDropdownMenuID,
}) => {
  UserDropdownMenu.deleteOne({
    id: userDropdownMenuID,
  })
    .select(["-_id"])
    .then(async (result) => {
      if (result && result.deletedCount === 1) {
        res.json({
          status: "success",
          message: `User dropdown menu with user dropdown menu id ${userDropdownMenuID} is deleted successfully.`,
          data: {},
        });
      } else {
        res.json({
          status: "error",
          message: `User dropdown menu with user dropdown menu id ${userDropdownMenuID} is not deleted.`,
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

module.exports.checkValidationOfUpdateDataFieldsUtil = async ({ req }) => {
  if (
    !req?.params?.userDropdownMenuID ||
    req.params.userDropdownMenuID === ""
  ) {
    return {
      status: "error",
      message: "User dropdown menu id is required in url.",
      data: {},
    };
  }
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Id is required in body.",
      data: {},
    };
  }
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: "User dropdown menu title is required.",
      data: {},
    };
  }
  if (!req?.body?.menuPath || req.body.menuPath === "") {
    return {
      status: "error",
      message: "User dropdown menu path is required.",
      data: {},
    };
  }
  if (
    req?.body?.priority === null ||
    req.body.priority === undefined ||
    req.body.priority === ""
  ) {
    return {
      status: "error",
      message: "Priority is required.",
      data: {},
    };
  }
  if (
    req?.body?.isActive === undefined ||
    req.body.isActive === null ||
    req.body.isActive === ""
  ) {
    return {
      status: "error",
      message: "isActive flag is required.",
      data: {},
    };
  }
  if (
    req?.body?.isDeleteable === undefined ||
    req.body.isDeleteable === null ||
    req.body.isDeleteable === ""
  ) {
    return {
      status: "error",
      message: "isDeleteable flag is required.",
      data: {},
    };
  }
  if (
    req?.body?.isAdminDeleteable === undefined ||
    req.body.isAdminDeleteable === null ||
    req.body.isAdminDeleteable === ""
  ) {
    return {
      status: "error",
      message: "isAdminDeleteable flag is required.",
      data: {},
    };
  }
  return {
    status: "success",
    message: "Valid.",
    data: {},
  };
};

module.exports.updateUserDropdownMenuUtil = async ({ req, res }) => {
  const userDropdownMenuID = req.params.userDropdownMenuID;
  const userDropdownMenuPriority = req.body.priority;
  const userDropdownMenuTitle = req.body.title;
  const userDropdownMenuPath = req.body.menuPath;
  const isActive = req.body.isActive;
  const isDeleteable = req.body.isDeleteable;
  const isAdminDeleteable = req.body.isAdminDeleteable;
  const dateAdded = req?.body?.dateAdded ? req.body.dateAdded : new Date();
  const dateModified = new Date();

  const newUserDropdownMenu = {
    id: userDropdownMenuID,
    title: userDropdownMenuTitle,
    menuPath: userDropdownMenuPath,
    priority: userDropdownMenuPriority,
    isActive: isActive,
    isDeleteable: isDeleteable,
    isAdminDeleteable: isAdminDeleteable,
    dateAdded: dateAdded,
    dateModified: dateModified,
  };

  const updatedUserDropdownMenuSet = {
    $set: newUserDropdownMenu,
  };
  UserDropdownMenu.updateOne(
    { id: userDropdownMenuID },
    updatedUserDropdownMenuSet
  )
    .then((respondedUserDropdownMenuData) => {
      if (
        respondedUserDropdownMenuData &&
        Object.keys(respondedUserDropdownMenuData).length > 0
      ) {
        res.json({
          status: "success",
          message: `User dropdown menu is updated successfully.`,
          data: newUserDropdownMenu,
        });
      } else {
        res.json({
          status: "error",
          message: `User dropdown menu is not updated due to unknown error.`,
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
