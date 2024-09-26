const UserDropdownMenuUtility = require("../../utilities/v3/userDropdownMenuUtility");
const UserDropdownMenu = require("../../model/v3/userDropdownMenu");
const CommonUtility = require("../../utilities/v3/commonUtility");

module.exports.getAllUserDropdownMenus = async (req, res) => {
  try {
    const foundDataObject =
      await UserDropdownMenuUtility.getAllUserDropdownMenusUtil({
        req,
      });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: [],
    });
  }
};

module.exports.getUserDropdownMenuById = async (req, res) => {
  if (
    !req?.params?.userDropdownMenuID ||
    req.params.userDropdownMenuID === ""
  ) {
    res.json({
      status: "error",
      message:
        "User dropdown menu id is required to get user dropdown menu by id.",
      data: {},
    });
    return;
  }
  try {
    const userDropdownMenuID = req.params.userDropdownMenuID;
    const foundDataObj =
      await UserDropdownMenuUtility.getUserDropdownMenuByIdUtil({
        userDropdownMenuID,
      });
    res.json(foundDataObj);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in getUserDropdownMenuById in userDropdownMenu file. ${error.message}`,
      data: {},
    });
  }
};

module.exports.addUserDropdownMenu = async (req, res) => {
  if (!req?.body?.title || req.body.title === "") {
    res.json({
      status: "error",
      message: "User dropdown menu title is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.menuPath || req.body.menuPath === "") {
    res.json({
      status: "error",
      message: "User dropdown menuPath is required.",
      data: {},
    });
    return;
  }
  if (req?.body?.priority === undefined || req.body.priority === null) {
    res.json({
      status: "error",
      message: "User dropdown priority is required.",
      data: {},
    });
    return;
  }

  const userDropdownMenuId = CommonUtility.getUniqueID();
  const userDropdownMenuTitle = req.body.title;
  const userDropdownMenuPath = req.body.menuPath;
  const userDropdownMenuPriority = req.body.priority;
  const isActive =
    req?.body?.isActive !== undefined && req.body.isActive !== null
      ? req.body.isActive
      : false;
  const isDeleteable =
    req?.body?.isDeleteable !== undefined && req.body.isDeleteable !== null
      ? req.body.isDeleteable
      : false;
  const isAdminDeleteable =
    req?.body?.isDeleteable !== undefined && req.body.isDeleteable !== null
      ? req.body.isDeleteable
      : false;

  const foundDataByTitleObject =
    await UserDropdownMenuUtility.getUserDropdownMenuDataByTitleInDbUtil({
      userDropdownMenuTitle,
    });
  if (foundDataByTitleObject?.status === "success") {
    res.json(foundDataByTitleObject);
    return;
  }

  const foundDataByPriorityObject =
    await UserDropdownMenuUtility.getUserDropdownMenuDataByPriorityInDbUtil({
      priority: userDropdownMenuPriority,
    });
  if (foundDataByPriorityObject?.status === "success") {
    res.json(foundDataByPriorityObject);
    return;
  }

  const newUserDropdownMenuSchema = new UserDropdownMenu({
    id: userDropdownMenuId,
    title: userDropdownMenuTitle,
    menuPath: userDropdownMenuPath,
    priority: userDropdownMenuPriority,
    isActive: isActive,
    isDeleteable: isDeleteable,
    isAdminDeleteable: isAdminDeleteable,
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  UserDropdownMenuUtility.addNewUserDropdownMenuUtil({
    userDropdownMenuSchema: newUserDropdownMenuSchema,
    res,
  });
};

module.exports.updateUserDropdownMenu = async (req, res) => {
  const foundValidationObject =
    await UserDropdownMenuUtility.checkValidationOfUpdateDataFieldsUtil({
      req,
    });
  if (foundValidationObject?.status === "error") {
    res.json(foundValidationObject);
    return;
  }

  const userDropdownMenuID = req.params.userDropdownMenuID;
  const userDropdownMenuPriority = req.body.priority;

  const foundDataByIdObject =
    await UserDropdownMenuUtility.getUserDropdownMenuByIdUtil({
      userDropdownMenuID,
    });

  if (foundDataByIdObject?.status === "error") {
    res.json(foundDataByIdObject);
    return;
  }

  const foundDataByPriorityObject =
    await UserDropdownMenuUtility.getUserDropdownMenuDataByPriorityInDbUtil({
      priority: userDropdownMenuPriority,
    });
  if (
    foundDataByPriorityObject?.status === "success" &&
    foundDataByPriorityObject?.data?.id !== userDropdownMenuID
  ) {
    res.json(foundDataByPriorityObject);
    return;
  }

  UserDropdownMenuUtility.updateUserDropdownMenuUtil({ req, res });
};

module.exports.deleteUserDropdownMenu = async (req, res) => {
  if (
    !req?.params?.userDropdownMenuID ||
    req.params.userDropdownMenuID === ""
  ) {
    res.json({
      status: "error",
      message: "Country id is required in url.",
      data: {},
    });
    return;
  }
  try {
    const userDropdownMenuID = req.params.userDropdownMenuID;
    const foundDataObj =
      await UserDropdownMenuUtility.getUserDropdownMenuByIdUtil({
        userDropdownMenuID,
      });
    if (foundDataObj?.status === "success") {
      UserDropdownMenuUtility.deleteUserDropdownMenuDataUtil({
        res,
        userDropdownMenuID,
      });
    } else {
      res.json(foundDataObj);
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in getUserDropdownMenuById in userDropdownMenu file while trying to fetch user dropdown menu by id for deletion. ${error.message}`,
      data: {},
    });
  }
};

module.exports.getUserDropdownMenusHighestPriority = async (req, res) => {
  try {
    const foundObject =
      await UserDropdownMenuUtility.getAllUserDropdownMenusUtil({
        req,
      });

    let maxPriorityObject = {
      priority: 0,
    };
    if (foundObject?.data && foundObject.data.length > 0) {
      maxPriorityObject = foundObject?.data?.reduce(function (prev, current) {
        return prev && prev.y > current.y ? prev : current;
      });
    }
    res.json({
      status: foundObject?.status,
      message:
        foundObject?.status === "success"
          ? "Highest priority value is fetched successfully."
          : "There is an error in fetching highest priority value. So default value is 0.",
      data: {
        maxPriorityValue: maxPriorityObject?.priority ?? 0,
      },
    });
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: {
        maxPriorityValue: 0,
      },
    });
  }
};

module.exports.getAllUserDropdownMenusRegisteredPriorities = async (
  req,
  res
) => {
  try {
    const allUserDropdownMenusObject =
      await UserDropdownMenuUtility.getAllUserDropdownMenusUtil({
        req,
      });
    if (
      allUserDropdownMenusObject.status === "success" &&
      allUserDropdownMenusObject?.data &&
      allUserDropdownMenusObject.data.length > 0
    ) {
      const prioritiesData =
        UserDropdownMenuUtility.getAllUserDropdownMenusPrioritiesUtil({
          allUserDropdownMenusObject,
        });
      res.json({
        status: allUserDropdownMenusObject.status,
        message: `User dropdown menus priorities found.`,
        data: prioritiesData,
      });
    } else {
      res.json({
        status: "error",
        message: `User dropdown menus priorities not found.`,
        data: [],
      });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: [],
    });
  }
};

module.exports.getUserDropdownMenuByPriority = async (req, res) => {
  if (req?.params?.priority === undefined || req.params.priority === null) {
    res.json({
      status: "error",
      message:
        "User dropdown menu priority is required to get user dropdown menu by priority.",
      data: {},
    });
    return;
  }
  try {
    const priority = req.params.priority;
    const userDropdownMenuByPriorityResponse =
      await UserDropdownMenuUtility.getUserDropdownMenuDataByPriorityInDbUtil({
        priority: priority,
      });
    res.json(userDropdownMenuByPriorityResponse);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an unknown error occured in getUserDropdownMenuByPriority function. ${error.message}`,
      data: {},
    });
  }
};
