const AdminMenu = require("../model/adminMenu");
const AdminMenuStatusesUtility = require("../utilities/adminMenuStatusesUtility");

module.exports.checkAddAdminMenuBodyInfoValidation = async (req) => {
  if (!req?.body?.menuTitle || req.body.menuTitle === "") {
    return {
      isSucceeded: false,
      message: "Menu title is required.",
    };
  }
  if (!req?.body?.adminMenuStatusID || req.body.adminMenuStatusID === "") {
    return {
      isSucceeded: false,
      message: "Admin menu status id is required.",
    };
  }
  if (!req?.body?.adminMenuStatus || req.body.adminMenuStatus === "") {
    return {
      isSucceeded: false,
      message: "Admin menu status is required.",
    };
  }
  if (!req?.body?.description || req.body.description === "") {
    return {
      isSucceeded: false,
      message: "Menu description is required.",
    };
  }
  if (
    req?.body?.isDeleteable === undefined ||
    req.body.isDeleteable === null ||
    req.body.isDeleteable === ""
  ) {
    return {
      isSucceeded: false,
      message: "isDeleteable flag is required.",
    };
  }
  if (
    req?.body?.isAdminDeleteable === undefined ||
    req.body.isAdminDeleteable === null ||
    req.body.isAdminDeleteable === ""
  ) {
    return {
      isSucceeded: false,
      message: "isAdminDeleteable flag is required.",
    };
  }

  const { isAdminMenuStatusExists, isSucceeded: isSucceeded1 } =
    await AdminMenuStatusesUtility.getAdminMenuStatusDataByIdInDbUtil({
      adminMenuStatusesID: req.body.adminMenuStatusID,
    });
  if (!isAdminMenuStatusExists || !isSucceeded1) {
    return {
      isSucceeded: false,
      message: `Admin menu status id ${req.body.adminMenuStatusID} is not valid`,
    };
  }

  const {
    isAdminMenuStatusExists: isAdminMenuStatusExists2,
    isSucceeded: isSucceeded2,
  } =
    await AdminMenuStatusesUtility.getAdminMenuStatusDataByStatusTitleInDbUtil({
      menuStatusTitle: req.body.adminMenuStatus,
    });
  if (!isAdminMenuStatusExists2 || !isSucceeded2) {
    return {
      isSucceeded: false,
      message: `Admin menu status with title ${req.body.adminMenuStatus} is not valid`,
    };
  }

  return {
    isSucceeded: true,
    message: "",
  };
};

module.exports.getAdminMenuDataByIdInDbUtil = async ({ adminMenuID }) => {
  return await AdminMenu.findOne({
    id: adminMenuID,
  })
    .select(["-_id"])
    .then((respondedAdminMenuData) => {
      if (
        respondedAdminMenuData &&
        Object.keys(respondedAdminMenuData).length > 0
      ) {
        return {
          isAdminMenuExists: true,
          isSucceeded: true,
          isCatchError: false,
          message: `Admin menu with adminMenuID '${adminMenuID}' is already exists.`,
          data: respondedAdminMenuData,
        };
      } else {
        return {
          isAdminMenuExists: false,
          isSucceeded: false,
          isCatchError: false,
          message: `Admin menu with adminMenuID '${adminMenuID}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        isAdminMenuExists: true,
        isSucceeded: false,
        isCatchError: true,
        message: `There is an error occurred in fetching admin menu by adminMenuID. ${err.message}`,
        data: {},
      };
    });
};

module.exports.getAdminMenuDataByMenuTitleInDbUtil = async ({ menuTitle }) => {
  return await AdminMenu.findOne({
    menuTitle: menuTitle,
  })
    .select(["-_id"])
    .then((respondedAdminMenuObject) => {
      if (
        respondedAdminMenuObject &&
        Object.keys(respondedAdminMenuObject).length > 0
      ) {
        return {
          isAdminMenuExists: true,
          isSucceeded: true,
          isCatchError: false,
          message: `Admin menu with menuTitle '${menuTitle}' is already exists. Please use a different title.`,
          data: respondedAdminMenuObject,
        };
      } else {
        return {
          isAdminMenuExists: false,
          isSucceeded: false,
          isCatchError: false,
          message: `Admin menu with menuTitle '${menuTitle}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        isAdminMenuExists: true,
        isSucceeded: false,
        isCatchError: true,
        message: `There is an error occurred in fetching admin menu by menuTitle. ${err.message}`,
        data: {},
      };
    });
};

module.exports.checkAdminMenuValidationToAddNewMenuData = async (req) => {
  const checkAddAdminMenuBodyInfoValidation =
    await this.checkAddAdminMenuBodyInfoValidation(req);
  if (!checkAddAdminMenuBodyInfoValidation.isSucceeded) {
    return {
      status: "error",
      message: checkAddAdminMenuBodyInfoValidation.message,
      data: {},
    };
  }

  const getAdminMenuDataByMenuTitleInDbUtil =
    await this.getAdminMenuDataByMenuTitleInDbUtil({
      menuTitle: req.body.menuTitle,
    });
  if (getAdminMenuDataByMenuTitleInDbUtil.isAdminMenuExists) {
    return {
      status: "error",
      message: getAdminMenuDataByMenuTitleInDbUtil.message,
      data: {},
    };
  }

  return {
    status: "success",
    message: "Admin menu validation is succeeded.",
    data: {},
  };
};

module.exports.addNewAdminMenuUtil = async ({ adminMenuSchema, res }) => {
  return await adminMenuSchema
    .save()
    .then((respondedAdminMenuObject) => {
      if (
        respondedAdminMenuObject &&
        Object.keys(respondedAdminMenuObject).length > 0
      ) {
        res.json({
          status: "success",
          message: `New admin menu data is added successfully.`,
          data: respondedAdminMenuObject,
        });
      } else {
        res.json({
          status: "error",
          message: `Admin menu data is not added due to unknown error.`,
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

module.exports.deleteAdminMenuUtil = async ({ adminMenuID, res }) => {
  return await AdminMenu.deleteOne({
    id: adminMenuID,
  })
    .select(["-_id"])
    .then(async (result) => {
      if (result && result.deletedCount === 1) {
        res.json({
          status: "success",
          message: `Admin menu with admin menu id ${adminMenuID} is deleted successfully.`,
          data: {},
        });
      } else {
        res.json({
          status: "error",
          message: `Admin menu with admin menu id ${adminMenuID} is not deleted.`,
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

module.exports.checkUpdateAdminMenuBodyInfoValidation = async (req) => {
  const responseCheck = await this.checkAddAdminMenuBodyInfoValidation(req);
  if (!responseCheck.isSucceeded) {
    return {
      isSucceeded: false,
      message: responseCheck.message,
    };
  }
  if (!req?.params?.adminMenuID || req.params.adminMenuID === "") {
    return {
      isSucceeded: false,
      message: "Admin menu id is required in url.",
    };
  }
  if (!req?.body?.id || req.body.id === "") {
    return {
      isSucceeded: false,
      message: "Id is required in body.",
    };
  }
  if (!req?.body?.dateAdded || req.body.dateAdded === "") {
    return {
      isSucceeded: false,
      message: "Created date is required.",
    };
  }
  const { isAdminMenuExists, isSucceeded, message, data } =
    await this.getAdminMenuDataByIdInDbUtil({
      adminMenuID: req.body.id,
    });
  if (!isAdminMenuExists || !isSucceeded) {
    return {
      isSucceeded: false,
      message: message,
      data: data,
    };
  }

  return {
    isSucceeded: true,
    message: "",
  };
};

module.exports.updateAdminMenuUtil = async ({ req, res }) => {
  const menuID = req.body.id;
  const menuTitle = req.body.menuTitle;
  const description = req.body.description;
  const adminMenuStatusID = req.body.adminMenuStatusID;
  const adminMenuStatus = req.body.adminMenuStatus;
  const isDeleteable = req.body.isDeleteable;
  const isAdminDeleteable = req.body.isAdminDeleteable;
  const newAdminMenu = {
    id: menuID,
    menuTitle: menuTitle,
    description: description,
    adminMenuStatusID: adminMenuStatusID,
    adminMenuStatus: adminMenuStatus,
    isDeleteable: isDeleteable,
    isAdminDeleteable: isAdminDeleteable,
    dateAdded: req.body.dateAdded,
    dateModified: new Date(),
  };

  const updatedAdminMenuSet = {
    $set: newAdminMenu,
  };

  return await AdminMenu.updateOne({ id: menuID }, updatedAdminMenuSet)
    .then((respondedAdminMenuObject) => {
      if (
        respondedAdminMenuObject &&
        Object.keys(respondedAdminMenuObject).length > 0
      ) {
        res.json({
          status: "success",
          message: `Admin menu is updated successfully.`,
          data: newAdminMenu,
        });
      } else {
        res.json({
          status: "error",
          message: `Admin menu is not updated due to unknown error.`,
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

module.exports.getAllAdminMenusUtil = async ({ req }) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  return await AdminMenu.find()
    .select(["-_id"])
    .limit(limit)
    .sort({
      id: sort,
    })
    .then((adminMenus) => {
      if (adminMenus && adminMenus.length > 0) {
        return {
          status: "success",
          message: "Admin menus fetched successfully.",
          data: adminMenus,
        };
      } else {
        return {
          status: "error",
          message:
            "Admin menus fetched successfully. But admin menu doesn't have any data.",
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
