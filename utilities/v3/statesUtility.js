const States = require("../../model/v3/states");
const CommonUtility = require("./commonUtility");

module.exports.getStateByStateTitle = async ({ stateTitle }) => {
  return await States.findOne({
    title: stateTitle,
  })
    .select(["-_id"])
    .then((stateData) => {
      if (stateData && Object.keys(stateData).length > 0) {
        return {
          status: "success",
          message: `State with state title ${stateTitle} fetched successfully.`,
          data: CommonUtility.sortObject(stateData),
        };
      } else {
        return {
          status: "error",
          message: `There is no state exists with state title ${stateTitle}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getStateByStateTitle function in states utitlity file. ${err.message}`,
        data: {},
      };
    });
};

module.exports.addNewStateUtil = async ({ req, res }) => {
  const stateID = CommonUtility.getUniqueID();
  const stateTitle = req.body.title;
  const countryID = req.body.countryID;
  const isDeleteable = req.body.isDeleteable;
  const isAdminDeleteable = req.body.isAdminDeleteable;
  const dateAdded = new Date();
  const dateModified = new Date();
  const stateCode = CommonUtility.getStateCityCodeFromTitle({
    title: stateTitle,
  });

  const newStateSchema = States({
    id: stateID,
    title: stateTitle,
    code: stateCode?.toUpperCase(),
    countryID: countryID,
    isDeleteable: isDeleteable,
    isAdminDeleteable: isAdminDeleteable,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  newStateSchema
    .save()
    .then((respondedState) => {
      if (respondedState && Object.keys(respondedState).length > 0) {
        res.json({
          status: "success",
          message: `New state is added successfully.`,
          data: CommonUtility.sortObject(respondedState),
        });
      } else {
        res.json({
          status: "error",
          message: `State is not added due to unknown error.`,
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

module.exports.getAllStatesUtil = async ({ req }) => {
  const limit = req?.body?.limit ? Number(req.body.limit) : 0;
  const sort = req.body.sort == "desc" ? -1 : 1;

  return await States.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((allStates) => {
      if (allStates && allStates.length > 0) {
        return {
          status: "success",
          message: "States fetched successfully.",
          data: CommonUtility.sortObjectsOfArray(allStates),
        };
      } else {
        return {
          status: "success",
          message:
            "States fetched successfully. But states doesn't have any data.",
          data: [],
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getAllStatesUtil function in states utility. ${err.message}`,
        data: [],
      };
    });
};

module.exports.getStateByIdUtil = async ({ stateID }) => {
  return await States.findOne({
    id: stateID,
  })
    .select(["-_id"])
    .then((stateData) => {
      if (stateData && Object.keys(stateData).length > 0) {
        return {
          status: "success",
          message: `State with state id ${stateID} fetched successfully.`,
          data: CommonUtility.sortObject(stateData),
        };
      } else {
        return {
          status: "error",
          message: `There is no state exists with state id ${stateID}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getStateByIdUtil function in states utility file. ${err.message}`,
        data: {},
      };
    });
};

module.exports.deleteStateDataUtil = async ({ res, stateID }) => {
  States.deleteOne({
    id: stateID,
  })
    .select(["-_id"])
    .then(async (result) => {
      if (result && result.deletedCount === 1) {
        res.json({
          status: "success",
          message: `State with state id ${stateID} is deleted successfully.`,
          data: {},
        });
      } else {
        res.json({
          status: "error",
          message: `State with state id ${stateID} is not deleted.`,
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

module.exports.updateStateUtil = async ({ req, res }) => {
  const stateID = req.body.id;
  const countryID = req.body.countryID;
  const stateTitle = req.body.title;
  const isDeleteable = req.body.isDeleteable;
  const isAdminDeleteable = req.body.isAdminDeleteable;
  const dateModified = new Date();
  const stateCode = CommonUtility.getStateCityCodeFromTitle({
    title: stateTitle,
  });

  const newState = {
    id: stateID,
    title: stateTitle,
    code: stateCode?.toUpperCase(),
    countryID: countryID,
    isDeleteable: isDeleteable,
    isAdminDeleteable: isAdminDeleteable,
    dateModified: dateModified,
  };

  const updatedStateSet = {
    $set: newState,
  };
  States.updateOne({ id: stateID }, updatedStateSet)
    .then((respondedStateData) => {
      if (respondedStateData && Object.keys(respondedStateData).length > 0) {
        res.json({
          status: "success",
          message: `State is updated successfully.`,
          data: newState,
        });
      } else {
        res.json({
          status: "error",
          message: `State is not updated due to unknown error.`,
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

module.exports.getStateByCountryIdUtil = async ({
  allStatesRespDataObject,
  req,
}) => {
  const countryID = req.body.countryID;
  const dataArray = allStatesRespDataObject?.data ?? [];
  const newStatesArray = [];
  dataArray.map((dataObject) => {
    if (dataObject?.countryID === countryID) {
      newStatesArray.push(CommonUtility.sortObject(dataObject));
    }
  });
  if (newStatesArray && newStatesArray.length > 0) {
    return {
      status: "success",
      message: `States by country id ${countryID} fetched successfully`,
      data: newStatesArray,
    };
  }
  return {
    status: "success",
    message: `States by country id ${countryID} not fetched successfully`,
    data: [],
  };
};
