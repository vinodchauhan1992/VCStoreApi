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

  const menuId = CommonUtility.getUniqueID(req.body.menuTitle);
  const menuTitle = req.body.menuTitle;
  const description = req.body.description;
  const adminMenuStatusID = req.body.adminMenuStatusID;
  const adminMenuStatus = req.body.adminMenuStatus;
  const isDeleteable = req.body.isDeleteable;
  const isAdminDeleteable = req.body.isAdminDeleteable;

  const newAdminMenuSchema = new AdminMenu({
    id: menuId,
    menuTitle: menuTitle,
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
