const AdminSubmenu = require("../../model/adminSubmenu");
const AdminSubmenuUtility = require("../../utilities/adminSubmenuUtility");
const CommonUtility = require("../../utilities/commonUtility");
const AdminMenuStatusesUtility = require("../../utilities/adminMenuStatusesUtility");

module.exports.getAllAdminSubmenus = async (req, res) => {
  try {
    const { status, message, data } =
      await AdminSubmenuUtility.getAllAdminSubmenusUtil({
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

module.exports.getAdminSubmenuByID = async (req, res) => {
  if (!req?.params?.adminSubmenuID || req.params.adminSubmenuID === "") {
    res.json({
      status: "error",
      message: "Admin submenu id is required to get admin submenu by id.",
      data: {},
    });
  } else {
    const adminSubmenuID = req.params.adminSubmenuID;
    const { isSucceeded, message, data } =
      await AdminSubmenuUtility.getAdminSubmenuDataByIdInDbUtil({
        adminSubmenuID: adminSubmenuID,
      });
    res.json({
      status: isSucceeded ? "success" : "error",
      message: message,
      data: data,
    });
  }
};

module.exports.addNewAdminSubmenu = async (req, res) => {
  const checkAdminSubmenuValidationToAddNewSubmenuData =
    await AdminSubmenuUtility.checkAdminSubmenuValidationToAddNewSubmenuData(
      req
    );
  if (checkAdminSubmenuValidationToAddNewSubmenuData.status === "error") {
    res.json(checkAdminSubmenuValidationToAddNewSubmenuData);
    return;
  }

  const adminSubmenuID = CommonUtility.getUniqueID(req.body.submenuTitle);
  const submenuTitle = req.body.submenuTitle;
  const description = req.body.description;
  const statusID = req.body.statusID;
  const status = req.body.status;
  const adminMenuID = req.body.adminMenuID;
  const adminMenuTitle = req.body.adminMenuTitle;
  const isDeleteable = req.body.isDeleteable;
  const isAdminDeleteable = req.body.isAdminDeleteable;

  const newAdminSubmenuSchema = new AdminSubmenu({
    id: adminSubmenuID,
    submenuTitle: submenuTitle,
    description: description,
    adminMenuID: adminMenuID,
    adminMenuTitle: adminMenuTitle,
    statusID: statusID,
    status: status,
    isDeleteable: isDeleteable,
    isAdminDeleteable: isAdminDeleteable,
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  await AdminSubmenuUtility.addNewAdminSubmenuUtil({
    adminSubmenuSchema: newAdminSubmenuSchema,
    res: res,
  });
};

module.exports.deleteAdminSubmenu = async (req, res) => {
  if (req.params.adminSubmenuID == null) {
    res.json({
      status: "error",
      message: "Admin submenu id must be provided to delete a admin submenu.",
      data: {},
    });
  } else {
    const adminSubmenuID = req.params.adminSubmenuID;

    const { isSucceeded, isAdminSubmenuExists, message, data } =
      await AdminSubmenuUtility.getAdminSubmenuDataByIdInDbUtil({
        adminSubmenuID: adminSubmenuID,
      });

    if (isAdminSubmenuExists && isSucceeded) {
      // check if isDeleteable allowed and then delete
      if (
        data.isDeleteable ||
        (data.isAdminDeleteable && req?.headers?.panel_type === "admin_panel")
      ) {
        await AdminSubmenuUtility.deleteAdminSubmenuUtil({
          adminSubmenuID: adminSubmenuID,
          res: res,
        });
      } else {
        res.json({
          status: "error",
          message: `Admin submenu with adminID ${adminSubmenuID} can't be deleted as isDeleteable flag is ${data.isDeleteable} and isAdminDeleteable flag is ${data.isAdminDeleteable} and panel type is ${req?.headers?.panel_type} on this menu item.`,
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

module.exports.updateAdminSubmenu = async (req, res) => {
  const checkUpdateAdminSubmenuBodyInfoValidation =
    await AdminSubmenuUtility.checkUpdateAdminSubmenuBodyInfoValidation(req);
  if (!checkUpdateAdminSubmenuBodyInfoValidation.isSucceeded) {
    res.json({
      status: "error",
      message: checkUpdateAdminSubmenuBodyInfoValidation.message,
      data: {},
    });
    return;
  }

  await AdminSubmenuUtility.updateAdminSubmenuUtil({ req, res });
};

module.exports.updateAdminSubmenuStatus = async (req, res) => {
  if (!req?.params?.adminSubmenuID || req.params.adminSubmenuID === "") {
    res.json({
      status: "error",
      message: "Admin submenu id is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.statusID || req.body.statusID === "") {
    res.json({
      status: "error",
      message: "Status id is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.status || req.body.status === "") {
    res.json({
      status: "error",
      message: "Status is required.",
      data: {},
    });
    return;
  }

  console.log("req.body", req.body);

  const { isAdminMenuStatusExists, isSucceeded: isSucceeded1 } =
    await AdminMenuStatusesUtility.getAdminMenuStatusDataByIdInDbUtil({
      adminMenuStatusesID: req.body.statusID,
    });
  if (!isAdminMenuStatusExists || !isSucceeded1) {
    res.json({
      status: "error",
      message: `Admin menu status id ${req.body.statusID} is not valid`,
      data: {},
    });
    return;
  }

  const {
    isAdminMenuStatusExists: isAdminMenuStatusExists2,
    isSucceeded: isSucceeded2,
  } =
    await AdminMenuStatusesUtility.getAdminMenuStatusDataByStatusTitleInDbUtil({
      menuStatusTitle: req.body.status,
    });
  if (!isAdminMenuStatusExists2 || !isSucceeded2) {
    res.json({
      status: "error",
      message: `Admin menu status with title ${req.body.status} is not valid`,
      data: {},
    });
    return;
  }

  const adminSubmenuID = req.params.adminSubmenuID;

  const updatedAdminSubmenuStatus = {
    id: adminSubmenuID,
    statusID: req.body.statusID,
    status: req.body.status,
    dateModified: new Date(),
  };

  const updatedAdminSubmenuStatusSet = {
    $set: updatedAdminSubmenuStatus,
  };

  const { isSucceeded, isAdminSubmenuExists, message } =
    await AdminSubmenuUtility.getAdminSubmenuDataByIdInDbUtil({
      adminSubmenuID: adminSubmenuID,
    });

  if (isAdminSubmenuExists && isSucceeded) {
    AdminSubmenu.updateOne({ id: adminSubmenuID }, updatedAdminSubmenuStatusSet)
      .then(async (respondedAdminMenu) => {
        if (respondedAdminMenu && Object.keys(respondedAdminMenu).length > 0) {
          const { data } =
            await AdminSubmenuUtility.getAdminSubmenuDataByIdInDbUtil({
              adminSubmenuID: adminSubmenuID,
            });
          res.json({
            status: "success",
            message: `Admin submenu status is updated successfully.`,
            data: data,
          });
        } else {
          res.json({
            status: "error",
            message: `Admin submenu status is not updated due to unknown error.`,
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

module.exports.updateAdminSubmenuDeleteableFlag = async (req, res) => {
  if (!req?.params?.adminSubmenuID || req.params.adminSubmenuID === "") {
    res.json({
      status: "error",
      message: "Admin submenu id is required.",
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

  const adminSubmenuID = req.params.adminSubmenuID;

  const updatedAdminSubmenuDeletableFlag = {
    id: adminSubmenuID,
    isDeleteable: req.body.isDeleteable,
    dateModified: new Date(),
  };

  const updatedAdminSubmenuDeletableFlagSet = {
    $set: updatedAdminSubmenuDeletableFlag,
  };

  const { isSucceeded, isAdminSubmenuExists, message } =
    await AdminSubmenuUtility.getAdminSubmenuDataByIdInDbUtil({
      adminSubmenuID: adminSubmenuID,
    });

  if (isAdminSubmenuExists && isSucceeded) {
    AdminSubmenu.updateOne(
      { id: adminSubmenuID },
      updatedAdminSubmenuDeletableFlagSet
    )
      .then(async (respondedAdminMenu) => {
        if (respondedAdminMenu && Object.keys(respondedAdminMenu).length > 0) {
          const { data } =
            await AdminSubmenuUtility.getAdminSubmenuDataByIdInDbUtil({
              adminSubmenuID: adminSubmenuID,
            });
          res.json({
            status: "success",
            message: `Admin submenu deletable flag is updated successfully.`,
            data: data,
          });
        } else {
          res.json({
            status: "error",
            message: `Admin submenu deletable flag is not updated due to unknown error.`,
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
