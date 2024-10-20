const States = require("../../model/v3/states");
const CountriesSchema = require("../../model/v3/countries");
const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");

module.exports.getSingleCountryWithAllDetails = async ({ stateData }) => {
  const countryDetailsObject =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: CountriesSchema,
      schemaName: "Country",
      dataID: stateData?.countryID,
    });
  return {
    id: stateData?.id,
    title: stateData?.title,
    code: stateData?.code,
    countryDetails: countryDetailsObject?.data ?? { id: stateData?.countryID },
    dateAdded: stateData?.dateAdded,
    dateModified: stateData?.dateModified,
  };
};

module.exports.getAllCountriesWithAllDetails = async ({ allStates }) => {
  return Promise.all(
    allStates?.map(async (stateData) => {
      const stateDetails = await this.getSingleCountryWithAllDetails({
        stateData: stateData,
      });
      return stateDetails;
    })
  );
};

module.exports.getStateByStateTitle = async ({ stateTitle }) => {
  return await States.findOne({
    title: stateTitle,
  })
    .select(["-_id"])
    .then(async (stateData) => {
      if (stateData && Object.keys(stateData).length > 0) {
        const fullDetailsData = await this.getSingleCountryWithAllDetails({
          stateData: stateData,
        });
        return {
          status: "success",
          message: `State with state title ${stateTitle} fetched successfully.`,
          data: CommonUtility.sortObject(fullDetailsData),
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
  const dateAdded = new Date();
  const dateModified = new Date();
  const stateCode = CommonUtility.getCodeFromTitle({
    title: stateTitle,
  });

  const newStateSchema = States({
    id: stateID,
    title: stateTitle,
    code: stateCode?.toUpperCase(),
    countryID: countryID,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  newStateSchema
    .save()
    .then(async (respondedState) => {
      if (respondedState && Object.keys(respondedState).length > 0) {
        const fullDetailsData = await this.getSingleCountryWithAllDetails({
          stateData: respondedState,
        });
        res.json({
          status: "success",
          message: `New state is added successfully.`,
          data: CommonUtility.sortObject(fullDetailsData),
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
    .then(async (allStates) => {
      if (allStates && allStates.length > 0) {
        const fullDetailsData = await this.getAllCountriesWithAllDetails({
          allStates: allStates,
        });
        return {
          status: "success",
          message: "States fetched successfully.",
          data: CommonUtility.sortObjectsOfArray(fullDetailsData),
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
    .then(async (stateData) => {
      if (stateData && Object.keys(stateData).length > 0) {
        const fullDetailsData = await this.getSingleCountryWithAllDetails({
          stateData: stateData,
        });
        return {
          status: "success",
          message: `State with state id ${stateID} fetched successfully.`,
          data: CommonUtility.sortObject(fullDetailsData),
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
  const dateModified = new Date();
  const stateCode = CommonUtility.getCodeFromTitle({
    title: stateTitle,
  });

  const newState = {
    id: stateID,
    title: stateTitle,
    code: stateCode?.toUpperCase(),
    countryID: countryID,
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
    if (dataObject?.countryDetails?.id === countryID) {
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
    message: `States by country id ${countryID} not fetched`,
    data: [],
  };
};
