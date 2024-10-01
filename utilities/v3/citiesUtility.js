const Cities = require("../../model/v3/cities");
const CommonUtility = require("./commonUtility");

module.exports.getCityByCityTitle = async ({ cityTitle }) => {
  return await Cities.findOne({
    title: cityTitle,
  })
    .select(["-_id"])
    .then((cityData) => {
      if (cityData && Object.keys(cityData).length > 0) {
        return {
          status: "success",
          message: `City with city title ${cityTitle} fetched successfully.`,
          data: CommonUtility.sortObject(cityData),
        };
      } else {
        return {
          status: "error",
          message: `There is no city exists with city title ${cityTitle}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getCityByCityTitle function in cities utitlity file. ${err.message}`,
        data: {},
      };
    });
};

module.exports.addNewCityUtil = async ({ req, res }) => {
  const cityID = CommonUtility.getUniqueID();
  const cityTitle = req.body.title;
  const countryID = req.body.countryID;
  const stateID = req.body.stateID;
  const isDeleteable = req.body.isDeleteable;
  const isAdminDeleteable = req.body.isAdminDeleteable;
  const dateAdded = new Date();
  const dateModified = new Date();
  const cityCode = CommonUtility.getStateCityCodeFromTitle({
    title: cityTitle,
  });

  console.log("cityCode", cityCode);
  const newCitySchema = Cities({
    id: cityID,
    title: cityTitle,
    code: cityCode?.toUpperCase(),
    countryID: countryID,
    stateID: stateID,
    isDeleteable: isDeleteable,
    isAdminDeleteable: isAdminDeleteable,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  newCitySchema
    .save()
    .then((respondedCity) => {
      if (respondedCity && Object.keys(respondedCity).length > 0) {
        res.json({
          status: "success",
          message: `New city is added successfully.`,
          data: CommonUtility.sortObject(respondedCity),
        });
      } else {
        res.json({
          status: "error",
          message: `City is not added due to unknown error.`,
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

module.exports.getAllCitiesUtil = async ({ req }) => {
  const limit = req?.body?.limit ? Number(req.body.limit) : 0;
  const sort = req.body.sort == "desc" ? -1 : 1;
  return await Cities.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((allCities) => {
      if (allCities && allCities.length > 0) {
        return {
          status: "success",
          message: "Cities fetched successfully.",
          data: CommonUtility.sortObjectsOfArray(allCities),
        };
      } else {
        return {
          status: "success",
          message:
            "Cities fetched successfully. But cities doesn't have any data.",
          data: [],
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getAllCitiesUtil function in cities utility. ${err.message}`,
        data: [],
      };
    });
};

module.exports.getCityByIdUtil = async ({ cityID }) => {
  return await Cities.findOne({
    id: cityID,
  })
    .select(["-_id"])
    .then((cityData) => {
      if (cityData && Object.keys(cityData).length > 0) {
        return {
          status: "success",
          message: `City with city id ${cityID} fetched successfully.`,
          data: CommonUtility.sortObject(cityData),
        };
      } else {
        return {
          status: "error",
          message: `There is no city exists with city id ${cityID}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getCityByIdUtil function in cities utility file. ${err.message}`,
        data: {},
      };
    });
};

module.exports.deleteCityDataUtil = async ({ res, cityID }) => {
  Cities.deleteOne({
    id: cityID,
  })
    .select(["-_id"])
    .then(async (result) => {
      if (result && result.deletedCount === 1) {
        res.json({
          status: "success",
          message: `City with city id ${cityID} is deleted successfully.`,
          data: {},
        });
      } else {
        res.json({
          status: "error",
          message: `City with city id ${cityID} is not deleted.`,
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

module.exports.updateCityUtil = async ({ req, res }) => {
  const cityID = req.body.id;
  const stateID = req.body.stateID;
  const countryID = req.body.countryID;
  const cityTitle = req.body.title;
  const isDeleteable = req.body.isDeleteable;
  const isAdminDeleteable = req.body.isAdminDeleteable;
  const dateModified = new Date();
  const cityCode = CommonUtility.getStateCityCodeFromTitle({
    title: cityTitle,
  });
  const newCity = {
    id: cityID,
    title: cityTitle,
    code: cityCode?.toUpperCase(),
    stateID: stateID,
    countryID: countryID,
    isDeleteable: isDeleteable,
    isAdminDeleteable: isAdminDeleteable,
    dateModified: dateModified,
  };
  const updatedCitySet = {
    $set: newCity,
  };
  Cities.updateOne({ id: cityID }, updatedCitySet)
    .then((respondedCityData) => {
      if (respondedCityData && Object.keys(respondedCityData).length > 0) {
        res.json({
          status: "success",
          message: `City is updated successfully.`,
          data: newCity,
        });
      } else {
        res.json({
          status: "error",
          message: `City is not updated due to unknown error.`,
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

module.exports.getCitiesByStateIdUtil = async ({
  allCitiesRespDataObject,
  req,
}) => {
  const stateID = req.body.stateID;
  const dataArray = allCitiesRespDataObject?.data ?? [];
  const newCitiesArray = [];
  dataArray.map((dataObject) => {
    if (dataObject?.stateID === stateID) {
      newCitiesArray.push(CommonUtility.sortObject(dataObject));
    }
  });
  if (newCitiesArray && newCitiesArray.length > 0) {
    return {
      status: "success",
      message: `Cities by state id ${stateID} fetched successfully`,
      data: newCitiesArray,
    };
  }
  return {
    status: "success",
    message: `Cities by state id ${stateID} not fetched successfully`,
    data: [],
  };
};

module.exports.getCitiesByCountryIdUtil = async ({
  allCitiesRespDataObject,
  req,
}) => {
  const countryID = req.body.countryID;
  const dataArray = allCitiesRespDataObject?.data ?? [];
  const newCitiesArray = [];
  dataArray.map((dataObject) => {
    if (dataObject?.countryID === countryID) {
      newCitiesArray.push(CommonUtility.sortObject(dataObject));
    }
  });
  if (newCitiesArray && newCitiesArray.length > 0) {
    return {
      status: "success",
      message: `Cities by country id ${countryID} fetched successfully`,
      data: newCitiesArray,
    };
  }
  return {
    status: "success",
    message: `Cities by country id ${countryID} not fetched successfully`,
    data: [],
  };
};
