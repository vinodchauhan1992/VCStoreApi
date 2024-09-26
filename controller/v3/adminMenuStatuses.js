const AdminMenuStatuses = require("../../model/v3/adminMenuStatuses");
const AdminMenuStatusesUtility = require("../../utilities/v3/adminMenuStatusesUtility");
const CommonUtility = require("../../utilities/v3/commonUtility");

module.exports.getAllAdminMenuStatuses = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  AdminMenuStatuses.find()
    .select(["-_id"])
    .limit(limit)
    .sort({
      id: sort,
    })
    .then((adminMenuStatuses) => {
      if (adminMenuStatuses && adminMenuStatuses.length > 0) {
        res.json({
          status: "success",
          message: "Admin menu statuses fetched successfully.",
          data: CommonUtility.sortObjectsOfArray(adminMenuStatuses),
        });
      } else {
        res.json({
          status: "error",
          message:
            "Admin menu statuses fetched successfully. But admin menu doesn't have any data.",
          data: [],
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${err.message}`,
        data: [],
      });
    });
};

module.exports.getAdminMenuStatusesByID = async (req, res) => {
  if (
    !req?.params?.adminMenuStatusesID ||
    req.params.adminMenuStatusesID === ""
  ) {
    res.json({
      status: "error",
      message:
        "Admin menu status id is required to get admin menu status by id.",
      data: {},
    });
  } else {
    const adminMenuStatusesID = req.params.adminMenuStatusesID;
    const { isSucceeded, message, data } =
      await AdminMenuStatusesUtility.getAdminMenuStatusDataByIdInDbUtil({
        adminMenuStatusesID: adminMenuStatusesID,
      });
    res.json({
      status: isSucceeded ? "success" : "error",
      message: message,
      data: data,
    });
  }
};

module.exports.addNewAdminMenuStatuses = async (req, res) => {
  const checkAdminMenuStatusValidationToAddNewMenuStatusData =
    await AdminMenuStatusesUtility.checkAdminMenuStatusValidationToAddNewMenuStatusData(
      req
    );
  if (checkAdminMenuStatusValidationToAddNewMenuStatusData.status === "error") {
    res.json(checkAdminMenuStatusValidationToAddNewMenuStatusData);
    return;
  }

  const menuStatusId = CommonUtility.getUniqueID();
  const menuStatusTitle = req.body.menuStatusTitle;
  const menuStatusDescription = req.body.menuStatusDescription;

  const newAdminMenuStatusSchema = new AdminMenuStatuses({
    id: menuStatusId,
    menuStatusTitle: menuStatusTitle,
    menuStatusDescription: menuStatusDescription,
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  await AdminMenuStatusesUtility.addNewAdminMenuStatusesUtil({
    adminMenuStatusesSchema: newAdminMenuStatusSchema,
    res: res,
  });
};

module.exports.deleteAdminMenuStatuses = async (req, res) => {
  if (req.params.adminMenuStatusesID == null) {
    res.json({
      status: "error",
      message:
        "Admin menu status id must be provided to delete a admin menu status.",
      data: {},
    });
  } else {
    const adminMenuStatusesID = req.params.adminMenuStatusesID;

    const { isSucceeded, isAdminMenuStatusExists, message, data } =
      await AdminMenuStatusesUtility.getAdminMenuStatusDataByIdInDbUtil({
        adminMenuStatusesID: adminMenuStatusesID,
      });

    if (isAdminMenuStatusExists && isSucceeded) {
      await AdminMenuStatusesUtility.deleteAdminMenuStatusUtil({
        adminMenuStatusesID: adminMenuStatusesID,
        res: res,
      });
    } else {
      res.json({
        status: isSucceeded ? "success" : "error",
        message: message,
        data: data,
      });
    }
  }
};

module.exports.updateAdminMenuStatuses = async (req, res) => {
  const checkUpdateAdminMenuStatusesBodyInfoValidation =
    await AdminMenuStatusesUtility.checkUpdateAdminMenuStatusesBodyInfoValidation(
      req
    );
  if (!checkUpdateAdminMenuStatusesBodyInfoValidation.isSucceeded) {
    res.json({
      status: "error",
      message: checkUpdateAdminMenuStatusesBodyInfoValidation.message,
      data: {},
    });
    return;
  }

  await AdminMenuStatusesUtility.updateAdminMenuStatusUtil({ req, res });
};
