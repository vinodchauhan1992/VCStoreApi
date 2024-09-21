const AdminMenuStatuses = require("../model/adminMenuStatuses");
const { sortObject } = require("./commonUtility");

module.exports.checkAddAdminMenuStatusesBodyInfoValidation = (req) => {
  if (!req?.body?.menuStatusTitle || req.body.menuStatusTitle === "") {
    return {
      isSucceeded: false,
      message: "Menu status title is required.",
    };
  }
  if (
    !req?.body?.menuStatusDescription ||
    req.body.menuStatusDescription === ""
  ) {
    return {
      isSucceeded: false,
      message: "Menu status description is required.",
    };
  }

  return {
    isSucceeded: true,
    message: "",
  };
};

module.exports.getAdminMenuStatusDataByIdInDbUtil = async ({
  adminMenuStatusesID,
}) => {
  return await AdminMenuStatuses.findOne({
    id: adminMenuStatusesID,
  })
    .select(["-_id"])
    .then((respondedAdminMenuStatusData) => {
      if (
        respondedAdminMenuStatusData &&
        Object.keys(respondedAdminMenuStatusData).length > 0
      ) {
        return {
          isAdminMenuStatusExists: true,
          isSucceeded: true,
          isCatchError: false,
          message: `Admin menu status with adminMenuStatusesID '${adminMenuStatusesID}' is already exists.`,
          data: sortObject(respondedAdminMenuStatusData),
        };
      } else {
        return {
          isAdminMenuStatusExists: false,
          isSucceeded: false,
          isCatchError: false,
          message: `Admin menu status with adminMenuStatusesID '${adminMenuStatusesID}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        isAdminMenuStatusExists: true,
        isSucceeded: false,
        isCatchError: true,
        message: `There is an error occurred in fetching admin menu status by adminMenuStatusesID. ${err.message}`,
        data: {},
      };
    });
};

module.exports.getAdminMenuStatusDataByStatusTitleInDbUtil = async ({
  menuStatusTitle,
}) => {
  return await AdminMenuStatuses.findOne({
    menuStatusTitle: menuStatusTitle,
  })
    .select(["-_id"])
    .then((respondedAdminMenuStatusObject) => {
      if (
        respondedAdminMenuStatusObject &&
        Object.keys(respondedAdminMenuStatusObject).length > 0
      ) {
        return {
          isAdminMenuStatusExists: true,
          isSucceeded: true,
          isCatchError: false,
          message: `Admin menu status with menuStatusTitle '${menuStatusTitle}' is already exists. Please use a different title.`,
          data: respondedAdminMenuStatusObject,
        };
      } else {
        return {
          isAdminMenuStatusExists: false,
          isSucceeded: false,
          isCatchError: false,
          message: `Admin menu status with menuStatusTitle '${menuStatusTitle}' doesn't exists.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        isAdminMenuStatusExists: true,
        isSucceeded: false,
        isCatchError: true,
        message: `There is an error occurred in fetching admin menu status by menuStatusTitle. ${err.message}`,
        data: {},
      };
    });
};

module.exports.checkAdminMenuStatusValidationToAddNewMenuStatusData = async (
  req
) => {
  const checkAddAdminMenuStatusesBodyInfoValidation =
    this.checkAddAdminMenuStatusesBodyInfoValidation(req);
  if (!checkAddAdminMenuStatusesBodyInfoValidation.isSucceeded) {
    return {
      status: "error",
      message: checkAddAdminMenuStatusesBodyInfoValidation.message,
      data: {},
    };
  }

  const getAdminMenuStatusDataByStatusTitleInDbUtil =
    await this.getAdminMenuStatusDataByStatusTitleInDbUtil({
      menuStatusTitle: req.body.menuStatusTitle,
    });
  if (getAdminMenuStatusDataByStatusTitleInDbUtil.isAdminMenuStatusExists) {
    return {
      status: "error",
      message: getAdminMenuStatusDataByStatusTitleInDbUtil.message,
      data: {},
    };
  }

  return {
    status: "success",
    message: "Admin menu statuses validation is succeeded.",
    data: {},
  };
};

module.exports.addNewAdminMenuStatusesUtil = async ({
  adminMenuStatusesSchema,
  res,
}) => {
  return await adminMenuStatusesSchema
    .save()
    .then((respondedAdminMenuStatusObject) => {
      if (
        respondedAdminMenuStatusObject &&
        Object.keys(respondedAdminMenuStatusObject).length > 0
      ) {
        res.json({
          status: "success",
          message: `New admin menu status data is added successfully.`,
          data: respondedAdminMenuStatusObject,
        });
      } else {
        res.json({
          status: "error",
          message: `Admin menu status data is not added due to unknown error.`,
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

module.exports.checkUpdateAdminMenuStatusesBodyInfoValidation = async (req) => {
  const responseCheck = this.checkAddAdminMenuStatusesBodyInfoValidation(req);
  if (!responseCheck.isSucceeded) {
    return {
      isSucceeded: false,
      message: responseCheck.message,
    };
  }
  if (
    !req?.params?.adminMenuStatusesID ||
    req.params.adminMenuStatusesID === ""
  ) {
    return {
      isSucceeded: false,
      message: "Admin menu status id is required in url.",
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
  const { isAdminMenuStatusExists, isSucceeded, message, data } =
    await this.getAdminMenuStatusDataByIdInDbUtil({
      adminMenuStatusesID: req.body.id,
    });
  if (!isAdminMenuStatusExists || !isSucceeded) {
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

module.exports.updateAdminMenuStatusUtil = async ({ req, res }) => {
  const adminMenuStatusesID = req.body.id;
  const menuStatusTitle = req.body.menuStatusTitle;
  const menuStatusDescription = req.body.menuStatusDescription;
  const newAdminMenuStatus = {
    id: adminMenuStatusesID,
    menuStatusTitle: menuStatusTitle,
    menuStatusDescription: menuStatusDescription,
    dateAdded: req.body.dateAdded,
    dateModified: new Date(),
  };

  const updatedAdminMenuStatusSet = {
    $set: newAdminMenuStatus,
  };

  return await AdminMenuStatuses.updateOne(
    { id: adminMenuStatusesID },
    updatedAdminMenuStatusSet
  )
    .then((respondedAdminMenuStatusObject) => {
      if (
        respondedAdminMenuStatusObject &&
        Object.keys(respondedAdminMenuStatusObject).length > 0
      ) {
        res.json({
          status: "success",
          message: `Admin menu status is updated successfully.`,
          data: newAdminMenuStatus,
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
        message: `There is an error occurred. ${err.message}`,
        data: {},
      });
    });
};

module.exports.deleteAdminMenuStatusUtil = async ({
  adminMenuStatusesID,
  res,
}) => {
  return await AdminMenuStatuses.deleteOne({
    id: adminMenuStatusesID,
  })
    .select(["-_id"])
    .then(async (result) => {
      if (result && result.deletedCount === 1) {
        res.json({
          status: "success",
          message: `Admin menu status with admin menu status id ${adminMenuStatusesID} is deleted successfully.`,
          data: {},
        });
      } else {
        res.json({
          status: "error",
          message: `Admin menu status with admin menu status id ${adminMenuStatusesID} is not deleted.`,
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
