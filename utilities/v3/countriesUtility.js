const Countries = require("../../model/v3/countries");
const CommonUtility = require("./commonUtility");

module.exports.getCountryByCountryCode = async ({ countryCode }) => {
  return await Countries.findOne({
    code: countryCode,
  })
    .select(["-_id"])
    .then((countryData) => {
      if (countryData && Object.keys(countryData).length > 0) {
        return {
          status: "success",
          message: `Country with country code ${countryCode} fetched successfully.`,
          data: CommonUtility.sortObject(countryData),
        };
      } else {
        return {
          status: "error",
          message: `There is no country exists with country code ${countryCode}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getCountryByCountryCode function in countries utitlity file. ${err.message}`,
        data: {},
      };
    });
};

module.exports.getCountryByCountryTitle = async ({ countryTitle }) => {
  return await Countries.findOne({
    title: countryTitle,
  })
    .select(["-_id"])
    .then((countryData) => {
      if (countryData && Object.keys(countryData).length > 0) {
        return {
          status: "success",
          message: `Country with country title ${countryTitle} fetched successfully.`,
          data: CommonUtility.sortObject(countryData),
        };
      } else {
        return {
          status: "error",
          message: `There is no country exists with country title ${countryTitle}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getCountryByCountryTitle function in countries utitlity file. ${err.message}`,
        data: {},
      };
    });
};

module.exports.addNewCountryUtil = async ({ req, res }) => {
  const countryID = CommonUtility.getUniqueID();
  const countryTitle = req.body.title;
  const countryCode = req.body.code;
  const isDeleteable = req.body.isDeleteable;
  const isAdminDeleteable = req.body.isAdminDeleteable;
  const dateAdded = new Date();
  const dateModified = new Date();

  const newCountrySchema = Countries({
    id: countryID,
    title: countryTitle,
    code: countryCode,
    isDeleteable: isDeleteable,
    isAdminDeleteable: isAdminDeleteable,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  newCountrySchema
    .save()
    .then((respondedCountry) => {
      if (respondedCountry && Object.keys(respondedCountry).length > 0) {
        res.json({
          status: "success",
          message: `New country is added successfully.`,
          data: CommonUtility.sortObject(respondedCountry),
        });
      } else {
        res.json({
          status: "error",
          message: `Country is not added due to unknown error.`,
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

module.exports.getAllCountriesUtil = async ({ req }) => {
  const limit = req?.body?.limit ? Number(req.body.limit) : 0;
  const sort = req.body.sort == "desc" ? -1 : 1;

  return await Countries.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((allCountries) => {
      if (allCountries && allCountries.length > 0) {
        return {
          status: "success",
          message: "Countries fetched successfully.",
          data: CommonUtility.sortObjectsOfArray(allCountries),
        };
      } else {
        return {
          status: "success",
          message:
            "Countries fetched successfully. But countries doesn't have any data.",
          data: [],
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getAllCountriesUtil function in countries utility. ${err.message}`,
        data: [],
      };
    });
};

module.exports.getCountryByIdUtil = async ({ countryID }) => {
  return await Countries.findOne({
    id: countryID,
  })
    .select(["-_id"])
    .then((countryData) => {
      if (countryData && Object.keys(countryData).length > 0) {
        return {
          status: "success",
          message: `Country with country id ${countryID} fetched successfully.`,
          data: CommonUtility.sortObject(countryData),
        };
      } else {
        return {
          status: "error",
          message: `There is no country exists with country id ${countryID}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getCountryByIdUtil function in countries utility file. ${err}`,
        data: {},
      };
    });
};

module.exports.deleteCountryDataUtil = async ({ res, countryID }) => {
  Countries.deleteOne({
    id: countryID,
  })
    .select(["-_id"])
    .then(async (result) => {
      if (result && result.deletedCount === 1) {
        res.json({
          status: "success",
          message: `Country with country id ${countryID} is deleted successfully.`,
          data: {},
        });
      } else {
        res.json({
          status: "error",
          message: `Country with country id ${countryID} is not deleted.`,
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

module.exports.updateCountryUtil = async ({ req, res }) => {
  const countryID = req.body.id;
  const countryTitle = req.body.title;
  const countryCode = req.body.code;
  const isDeleteable = req.body.isDeleteable;
  const isAdminDeleteable = req.body.isAdminDeleteable;
  const dateModified = new Date();

  const newCountry = {
    id: countryID,
    title: countryTitle,
    code: countryCode,
    isDeleteable: isDeleteable,
    isAdminDeleteable: isAdminDeleteable,
    dateModified: dateModified,
  };

  const updatedCountrySet = {
    $set: newCountry,
  };
  Countries.updateOne({ id: countryID }, updatedCountrySet)
    .then((respondedCountryData) => {
      if (
        respondedCountryData &&
        Object.keys(respondedCountryData).length > 0
      ) {
        res.json({
          status: "success",
          message: `Country is updated successfully.`,
          data: newCountry,
        });
      } else {
        res.json({
          status: "error",
          message: `Country is not updated due to unknown error.`,
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
};
