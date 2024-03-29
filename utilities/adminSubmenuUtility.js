const AdminSubmenu = require("../model/adminSubmenu");
const AdminMenuStatusesUtility = require("../utilities/adminMenuStatusesUtility");
const AdminMenuUtility = require("../utilities/adminMenuUtility");

module.exports.checkAddAdminSubmenuBodyInfoValidation = async (req) => {
  if (!req?.body?.submenuTitle || req.body.submenuTitle === "") {
    return {
      isSucceeded: false,
      message: "Submenu title is required.",
    };
  }
  if (!req?.body?.adminMenuID || req.body.adminMenuID === "") {
    return {
      isSucceeded: false,
      message: "Admin menu id is required.",
    };
  }
  if (!req?.body?.adminMenuTitle || req.body.adminMenuTitle === "") {
    return {
      isSucceeded: false,
      message: "Admin menu title is required.",
    };
  }
  if (!req?.body?.statusID || req.body.statusID === "") {
    return {
      isSucceeded: false,
      message: "Status id is required.",
    };
  }
  if (!req?.body?.status || req.body.status === "") {
    return {
      isSucceeded: false,
      message: "Status is required.",
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
      adminMenuStatusesID: req.body.statusID,
    });
  if (!isAdminMenuStatusExists || !isSucceeded1) {
    return {
      isSucceeded: false,
      message: `Status id ${req.body.statusID} is not valid`,
    };
  }

  const {
    isAdminMenuStatusExists: isAdminMenuStatusExists2,
    isSucceeded: isSucceeded2,
  } =
    await AdminMenuStatusesUtility.getAdminMenuStatusDataByStatusTitleInDbUtil({
      menuStatusTitle: req.body.status,
    });
  if (!isAdminMenuStatusExists2 || !isSucceeded2) {
    return {
      isSucceeded: false,
      message: `Status with title ${req.body.status} is not valid`,
    };
  }

  const { isAdminMenuExists, isSucceeded: isSucceeded3 } =
    await AdminMenuUtility.getAdminMenuDataByIdInDbUtil({
      adminMenuID: req.body.adminMenuID,
    });
  if (!isAdminMenuExists || !isSucceeded3) {
    return {
      isSucceeded: false,
      message: `Admin menu id ${req.body.adminMenuID} is not valid`,
    };
  }

  const { isAdminMenuExists: isAdminMenuExists1, isSucceeded: isSucceeded4 } =
    await AdminMenuUtility.getAdminMenuDataByMenuTitleInDbUtil({
      menuTitle: req.body.adminMenuTitle,
    });
  if (!isAdminMenuExists1 || !isSucceeded4) {
    return {
      isSucceeded: false,
      message: `Admin menu title ${req.body.adminMenuTitle} is not valid`,
    };
  }

  return {
    isSucceeded: true,
    message: "",
  };
};

module.exports.getAdminSubmenuDataByIdInDbUtil = async ({ adminSubmenuID }) => {
  return await AdminSubmenu.findOne({
    id: adminSubmenuID,
  })
    .select(["-_id"])
    .then((respondedAdminSubmenuData) => {
      if (
        respondedAdminSubmenuData &&
        Object.keys(respondedAdminSubmenuData).length > 0
      ) {
        return {
          isAdminSubmenuExists: true,
          isSucceeded: true,
          isCatchError: false,
          message: `Admin submenu with adminSubmenuID '${adminSubmenuID}' is already exists.`,
          data: respondedAdminSubmenuData,
        };
      } else {
        return {
          isAdminSubmenuExists: false,
          isSucceeded: false,
          isCatchError: false,
          message: `Admin submenu with adminSubmenuID '${adminSubmenuID}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        isAdminSubmenuExists: true,
        isSucceeded: false,
        isCatchError: true,
        message: `There is an error occurred in fetching admin submenu by adminSubmenuID. ${err.message}`,
        data: {},
      };
    });
};

module.exports.getAdminMenuDataBySubmenuTitleInDbUtil = async ({
  submenuTitle,
}) => {
  return await AdminSubmenu.findOne({
    submenuTitle: submenuTitle,
  })
    .select(["-_id"])
    .then((respondedAdminSubmenuObject) => {
      if (
        respondedAdminSubmenuObject &&
        Object.keys(respondedAdminSubmenuObject).length > 0
      ) {
        return {
          isAdminSubmenuExists: true,
          isSucceeded: true,
          isCatchError: false,
          message: `Admin submenu with submenuTitle '${submenuTitle}' is already exists. Please use a different title.`,
          data: respondedAdminSubmenuObject,
        };
      } else {
        return {
          isAdminSubmenuExists: false,
          isSucceeded: false,
          isCatchError: false,
          message: `Admin submenu with submenuTitle '${submenuTitle}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        isAdminSubmenuExists: true,
        isSucceeded: false,
        isCatchError: true,
        message: `There is an error occurred in fetching admin submenu by submenuTitle. ${err.message}`,
        data: {},
      };
    });
};

module.exports.checkAdminSubmenuValidationToAddNewSubmenuData = async (req) => {
  const checkAddAdminSubmenuBodyInfoValidation =
    await this.checkAddAdminSubmenuBodyInfoValidation(req);
  if (!checkAddAdminSubmenuBodyInfoValidation.isSucceeded) {
    return {
      status: "error",
      message: checkAddAdminSubmenuBodyInfoValidation.message,
      data: {},
    };
  }

  const getAdminMenuDataBySubmenuTitleInDbUtil =
    await this.getAdminMenuDataBySubmenuTitleInDbUtil({
      submenuTitle: req.body.submenuTitle,
    });
  if (getAdminMenuDataBySubmenuTitleInDbUtil.isAdminSubmenuExists) {
    return {
      status: "error",
      message: getAdminMenuDataBySubmenuTitleInDbUtil.message,
      data: {},
    };
  }

  return {
    status: "success",
    message: "Admin submenu validation is succeeded.",
    data: {},
  };
};

module.exports.addNewAdminSubmenuUtil = async ({ adminSubmenuSchema, res }) => {
  return await adminSubmenuSchema
    .save()
    .then((respondedAdminSubmenuObject) => {
      if (
        respondedAdminSubmenuObject &&
        Object.keys(respondedAdminSubmenuObject).length > 0
      ) {
        res.json({
          status: "success",
          message: `New admin submenu data is added successfully.`,
          data: respondedAdminSubmenuObject,
        });
      } else {
        res.json({
          status: "error",
          message: `Admin submenu data is not added due to unknown error.`,
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

module.exports.deleteAdminSubmenuUtil = async ({ adminSubmenuID, res }) => {
  return await AdminSubmenu.deleteOne({
    id: adminSubmenuID,
  })
    .select(["-_id"])
    .then(async (result) => {
      if (result && result.deletedCount === 1) {
        res.json({
          status: "success",
          message: `Admin submenu with admin submenu id ${adminSubmenuID} is deleted successfully.`,
          data: {},
        });
      } else {
        res.json({
          status: "error",
          message: `Admin submenu with admin submenu id ${adminSubmenuID} is not deleted.`,
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

module.exports.checkUpdateAdminSubmenuBodyInfoValidation = async (req) => {
  const responseCheck = await this.checkAddAdminSubmenuBodyInfoValidation(req);
  if (!responseCheck.isSucceeded) {
    return {
      isSucceeded: false,
      message: responseCheck.message,
    };
  }
  if (!req?.params?.adminSubmenuID || req.params.adminSubmenuID === "") {
    return {
      isSucceeded: false,
      message: "Admin submenu id is required in url.",
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
  const { isAdminSubmenuExists, isSucceeded, message, data } =
    await this.getAdminSubmenuDataByIdInDbUtil({
      adminSubmenuID: req.body.id,
    });
  if (!isAdminSubmenuExists || !isSucceeded) {
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

module.exports.updateAdminSubmenuUtil = async ({ req, res }) => {
  const adminSubmenuID = req.body.id;
  const submenuTitle = req.body.submenuTitle;
  const description = req.body.description;
  const statusID = req.body.statusID;
  const status = req.body.status;
  const adminMenuID = req.body.adminMenuID;
  const adminMenuTitle = req.body.adminMenuTitle;
  const isDeleteable = req.body.isDeleteable;
  const isAdminDeleteable = req.body.isAdminDeleteable;

  const newAdminSubmenu = {
    id: adminSubmenuID,
    submenuTitle: submenuTitle,
    description: description,
    statusID: statusID,
    status: status,
    adminMenuID: adminMenuID,
    adminMenuTitle: adminMenuTitle,
    isDeleteable: isDeleteable,
    isAdminDeleteable: isAdminDeleteable,
    dateAdded: req.body.dateAdded,
    dateModified: new Date(),
  };

  const updatedAdminSubmenuSet = {
    $set: newAdminSubmenu,
  };

  return await AdminSubmenu.updateOne(
    { id: adminSubmenuID },
    updatedAdminSubmenuSet
  )
    .then((respondedAdminSubmenuObject) => {
      if (
        respondedAdminSubmenuObject &&
        Object.keys(respondedAdminSubmenuObject).length > 0
      ) {
        res.json({
          status: "success",
          message: `Admin submenu is updated successfully.`,
          data: newAdminSubmenu,
        });
      } else {
        res.json({
          status: "error",
          message: `Admin submenu is not updated due to unknown error.`,
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

module.exports.getAllAdminSubmenusUtil = async ({ req }) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  return await AdminSubmenu.find()
    .select(["-_id"])
    .limit(limit)
    .sort({
      id: sort,
    })
    .then((adminSubmenus) => {
      if (adminSubmenus && adminSubmenus.length > 0) {
        return {
          status: "success",
          message: "Admin submenus fetched successfully.",
          data: adminSubmenus,
        };
      } else {
        return {
          status: "error",
          message:
            "Admin submenus fetched successfully. But admin submenu doesn't have any data.",
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
