const AdminMenu = require("../../model/adminMenu");
const AdminMenuUtility = require("../../utilities/adminMenuUtility");
const CommonUtility = require("../../utilities/commonUtility");
const AdminMenuStatusesUtility = require("../../utilities/adminMenuStatusesUtility");

module.exports.getAllAdminMenus = async (req, res) => {
  try {
    const { status, message, data } =
      await AdminMenuUtility.getAllAdminMenusUtil({
        req,
      });
    res.json({
      status: status,
      message: message,
      data: data,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: [],
    });
  }
};

module.exports.getAdminMenuByID = async (req, res) => {
  if (!req?.params?.adminMenuID || req.params.adminMenuID === "") {
    res.json({
      status: "error",
      message: "Admin menu id is required to get admin menu by id.",
      data: {},
    });
  } else {
    const adminMenuID = req.params.adminMenuID;
    const { isSucceeded, message, data } =
      await AdminMenuUtility.getAdminMenuDataByIdInDbUtil({
        adminMenuID: adminMenuID,
      });
    res.json({
      status: isSucceeded ? "success" : "error",
      message: message,
      data: data,
    });
  }
};

module.exports.addNewAdminMenu = async (req, res) => {
  const checkAdminMenuValidationToAddNewMenuData =
    await AdminMenuUtility.checkAdminMenuValidationToAddNewMenuData(req);
  if (checkAdminMenuValidationToAddNewMenuData.status === "error") {
    res.json(checkAdminMenuValidationToAddNewMenuData);
    return;
  }

  const menuId = CommonUtility.getUniqueID();
  const menuTitle = req.body.menuTitle;
  const description = req.body.description;
  const adminMenuStatusID = req.body.adminMenuStatusID;
  const adminMenuStatus = req.body.adminMenuStatus;
  const isDeleteable = req.body.isDeleteable;
  const isAdminDeleteable = req.body.isAdminDeleteable;
  const menuPath = req.body.menuPath;
  const priority = req.body.priority;
  const newAdminMenuSchema = new AdminMenu({
    id: menuId,
    menuTitle: menuTitle,
    menuPath: menuPath,
    priority: priority,
    description: description,
    adminMenuStatusID: adminMenuStatusID,
    adminMenuStatus: adminMenuStatus,
    isDeleteable: isDeleteable,
    isAdminDeleteable: isAdminDeleteable,
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  await AdminMenuUtility.addNewAdminMenuUtil({
    adminMenuSchema: newAdminMenuSchema,
    res: res,
  });
};

module.exports.deleteAdminMenu = async (req, res) => {
  if (req.params.adminMenuID == null) {
    res.json({
      status: "error",
      message: "Admin menu id must be provided to delete a admin menu.",
      data: {},
    });
  } else {
    const adminMenuID = req.params.adminMenuID;

    const { isSucceeded, isAdminMenuExists, message, data } =
      await AdminMenuUtility.getAdminMenuDataByIdInDbUtil({
        adminMenuID: adminMenuID,
      });

    if (isAdminMenuExists && isSucceeded) {
      // check if isDeleteable allowed and then delete
      if (
        data.isDeleteable ||
        (data.isAdminDeleteable && req?.headers?.panel_type === "admin_panel")
      ) {
        await AdminMenuUtility.deleteAdminMenuUtil({
          adminMenuID: adminMenuID,
          res: res,
        });
      } else {
        res.json({
          status: "error",
          message: `Admin menu with adminID ${adminMenuID} can't be deleted as isDeleteable flag is ${data.isDeleteable} and isAdminDeleteable flag is ${data.isAdminDeleteable} and panel type is ${req?.headers?.panel_type} on this menu item.`,
          data: data,
        });
      }
    } else {
      res.json({
        status: isSucceeded ? "success" : "error",
        message: message,
        data: data,
      });
    }
  }
};

module.exports.updateAdminMenu = async (req, res) => {
  const checkUpdateAdminMenuBodyInfoValidation =
    await AdminMenuUtility.checkUpdateAdminMenuBodyInfoValidation(req);
  if (!checkUpdateAdminMenuBodyInfoValidation.isSucceeded) {
    res.json({
      status: "error",
      message: checkUpdateAdminMenuBodyInfoValidation.message,
      data: {},
    });
    return;
  }

  await AdminMenuUtility.updateAdminMenuUtil({ req, res });
};

module.exports.updateAdminMenuStatus = async (req, res) => {
  if (!req?.params?.adminMenuID || req.params.adminMenuID === "") {
    res.json({
      status: "error",
      message: "Admin menu id is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.adminMenuStatusID || req.body.adminMenuStatusID === "") {
    res.json({
      status: "error",
      message: "Admin menu status id is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.adminMenuStatus || req.body.adminMenuStatus === "") {
    res.json({
      status: "error",
      message: "Admin menu status is required.",
      data: {},
    });
    return;
  }

  console.log("req.body", req.body);

  const { isAdminMenuStatusExists, isSucceeded: isSucceeded1 } =
    await AdminMenuStatusesUtility.getAdminMenuStatusDataByIdInDbUtil({
      adminMenuStatusesID: req.body.adminMenuStatusID,
    });
  if (!isAdminMenuStatusExists || !isSucceeded1) {
    res.json({
      status: "error",
      message: `Admin menu status id ${req.body.adminMenuStatusID} is not valid`,
      data: {},
    });
    return;
  }

  const {
    isAdminMenuStatusExists: isAdminMenuStatusExists2,
    isSucceeded: isSucceeded2,
  } =
    await AdminMenuStatusesUtility.getAdminMenuStatusDataByStatusTitleInDbUtil({
      menuStatusTitle: req.body.adminMenuStatus,
    });
  if (!isAdminMenuStatusExists2 || !isSucceeded2) {
    res.json({
      status: "error",
      message: `Admin menu status with title ${req.body.adminMenuStatus} is not valid`,
      data: {},
    });
    return;
  }

  const adminMenuID = req.params.adminMenuID;

  const updatedAdminMenuStatus = {
    id: adminMenuID,
    adminMenuStatusID: req.body.adminMenuStatusID,
    adminMenuStatus: req.body.adminMenuStatus,
    dateModified: new Date(),
  };

  const updatedAdminMenuStatusSet = {
    $set: updatedAdminMenuStatus,
  };

  const { isSucceeded, isAdminMenuExists, message } =
    await AdminMenuUtility.getAdminMenuDataByIdInDbUtil({
      adminMenuID: adminMenuID,
    });

  if (isAdminMenuExists && isSucceeded) {
    AdminMenu.updateOne({ id: adminMenuID }, updatedAdminMenuStatusSet)
      .then(async (respondedAdminMenu) => {
        if (respondedAdminMenu && Object.keys(respondedAdminMenu).length > 0) {
          const { data } = await AdminMenuUtility.getAdminMenuDataByIdInDbUtil({
            adminMenuID: adminMenuID,
          });
          res.json({
            status: "success",
            message: `Admin menu status is updated successfully.`,
            data: data,
          });
        } else {
          res.json({
            status: "error",
            message: `Admin menu status is not updated due to unknown error.`,
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

module.exports.updateAdminMenuDeleteableFlag = async (req, res) => {
  if (!req?.params?.adminMenuID || req.params.adminMenuID === "") {
    res.json({
      status: "error",
      message: "Admin menu id is required.",
      data: {},
    });
    return;
  }
  if (
    req?.body?.isDeleteable === undefined ||
    req.body.isDeleteable === null ||
    req.body.isDeleteable === ""
  ) {
    res.json({
      status: "error",
      message: "isDeleteable flag is required.",
      data: {},
    });
    return;
  }

  const adminMenuID = req.params.adminMenuID;

  const updatedAdminMenuDeletableFlag = {
    id: adminMenuID,
    isDeleteable: req.body.isDeleteable,
    dateModified: new Date(),
  };

  const updatedAdminMenuDeletableFlagSet = {
    $set: updatedAdminMenuDeletableFlag,
  };

  const { isSucceeded, isAdminMenuExists, message } =
    await AdminMenuUtility.getAdminMenuDataByIdInDbUtil({
      adminMenuID: adminMenuID,
    });

  if (isAdminMenuExists && isSucceeded) {
    AdminMenu.updateOne({ id: adminMenuID }, updatedAdminMenuDeletableFlagSet)
      .then(async (respondedAdminMenu) => {
        if (respondedAdminMenu && Object.keys(respondedAdminMenu).length > 0) {
          const { data } = await AdminMenuUtility.getAdminMenuDataByIdInDbUtil({
            adminMenuID: adminMenuID,
          });
          res.json({
            status: "success",
            message: `Admin menu deletable flag is updated successfully.`,
            data: data,
          });
        } else {
          res.json({
            status: "error",
            message: `Admin menu deletable flag is not updated due to unknown error.`,
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

module.exports.getAdminMenusHighestPriority = async (req, res) => {
  try {
    const { status, message, data } =
      await AdminMenuUtility.getAllAdminMenusUtil({
        req,
      });

    const maxPriorityObject = data.reduce(function (prev, current) {
      return prev && prev.y > current.y ? prev : current;
    });

    res.json({
      status: status,
      message:
        status === "success"
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

module.exports.getAllMenusRegisteredPriorities = async (req, res) => {
  try {
    const allAdminMenusObject = await AdminMenuUtility.getAllAdminMenusUtil({
      req,
    });
    if (
      allAdminMenusObject.status === "success" &&
      allAdminMenusObject?.data &&
      allAdminMenusObject.data.length > 0
    ) {
      const prioritiesData = AdminMenuUtility.getAllMenusPrioritiesUtil({
        allAdminMenusObject,
      });

      res.json({
        status: allAdminMenusObject.status,
        message: `Menus priorities found.`,
        data: prioritiesData,
      });
    } else {
      res.json({
        status: "error",
        message: `Menus priorities not found.`,
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

module.exports.getAdminMenuByPriority = async (req, res) => {
  if (req?.params?.priority === undefined || req.params.priority === null) {
    res.json({
      status: "error",
      message: "Menu priority is required to get menu by priority.",
      data: {},
    });
    return;
  }

  try {
    const priority = req.params.priority;
    const menuByPriorityResponse =
      await AdminMenuUtility.getAdminMenuDataByPriorityInDbUtil({
        priority: priority,
      });
    res.json({
      status: menuByPriorityResponse.isSucceeded ? "success" : "error",
      message: menuByPriorityResponse.message,
      data: menuByPriorityResponse?.data ?? {},
    });
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an unknown error occured in getAdminMenuByPriority function. ${error.message}`,
      data: {},
    });
  }
};

module.exports.updateMenuPriority = async (req, res) => {
  if (!req?.params?.adminMenuID || req.params.adminMenuID === "") {
    res.json({
      status: "error",
      message: "Admin menu id is required in url.",
      data: {},
    });
    return;
  }
  if (req?.body?.priority === undefined || req.body.priority === null) {
    res.json({
      status: "error",
      message: "Menu priority is required in body.",
      data: {},
    });
    return;
  }

  const adminMenuID = req.params.adminMenuID;
  const { isSucceeded } = await AdminMenuUtility.getAdminMenuDataByIdInDbUtil({
    adminMenuID: adminMenuID,
  });
  if (!isSucceeded) {
    res.json({
      status: "error",
      message: `Menu doesn't exists with menu id ${adminMenuID}.`,
      data: {},
    });
    return;
  }

  const priority = req.body.priority;
  const menuByPriorityResponse =
    await AdminMenuUtility.getAdminMenuDataByPriorityInDbUtil({
      priority: priority,
    });
  if (menuByPriorityResponse.isSucceeded) {
    const allAdminMenusObject = await AdminMenuUtility.getAllAdminMenusUtil({
      req,
    });
    const prioritiesData = AdminMenuUtility.getAllMenusPrioritiesUtil({
      allAdminMenusObject,
    });
    res.json({
      status: "error",
      message: `A Menu with priority ${priority} is already exists. Please choose a priority other than ${JSON.stringify(
        prioritiesData
      )}`,
      data: {},
    });
    return;
  }

  AdminMenuUtility.updateMenuPriorityInDbUtil({ req, res });
};
