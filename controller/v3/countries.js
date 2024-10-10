const CountriesUtility = require("../../utilities/v3/countriesUtility");

module.exports.getAllCountries = async (req, res) => {
  try {
    const foundDataObject = await CountriesUtility.getAllCountriesUtil({ req });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: [],
    });
  }
};

module.exports.getCountryById = async (req, res) => {
  if (!req?.body?.countryID || req.body.countryID === "") {
    res.json({
      status: "error",
      message: "Country id is required.",
      data: {},
    });
    return;
  }
  try {
    const countryID = req.body.countryID;
    const foundDataObj = await CountriesUtility.getCountryByIdUtil({
      countryID,
    });
    res.json(foundDataObj);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in getCountryById in countries file. ${error.message}`,
      data: {},
    });
  }
};

module.exports.addCountry = async (req, res) => {
  if (!req?.body?.title || req.body.title === "") {
    res.json({
      status: "error",
      message: "Country title is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.code || req.body.code === "") {
    res.json({
      status: "error",
      message: "Country code is required.",
      data: {},
    });
    return;
  }

  const foundCountryRespByCode = await CountriesUtility.getCountryByCountryCode(
    { countryCode: req.body.code }
  );
  if (foundCountryRespByCode?.status === "success") {
    res.json({
      status: foundCountryRespByCode.status,
      message: `Country cannot be added as country with country code ${req.body.code} already exists.`,
      data: foundCountryRespByCode.data,
    });
    return;
  }

  const foundCountryRespByTitle =
    await CountriesUtility.getCountryByCountryTitle({
      countryTitle: req.body.title,
    });
  if (foundCountryRespByTitle?.status === "success") {
    res.json({
      status: foundCountryRespByTitle.status,
      message: `Country cannot be added as country with country title ${req.body.title} already exists.`,
      data: foundCountryRespByTitle.data,
    });
    return;
  }

  CountriesUtility.addNewCountryUtil({ req, res });
};

module.exports.updateCountry = async (req, res) => {
  if (!req?.body?.id || req.body.id === "") {
    res.json({
      status: "error",
      message: "Id is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.title || req.body.title === "") {
    res.json({
      status: "error",
      message: "Title is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.code || req.body.code === "") {
    res.json({
      status: "error",
      message: "Code is required.",
      data: {},
    });
    return;
  }

  try {
    const countryID = req.body.id;
    const foundDataObj = await CountriesUtility.getCountryByIdUtil({
      countryID,
    });
    if (foundDataObj?.status === "success") {
      CountriesUtility.updateCountryUtil({ req, res });
    } else {
      res.json(foundDataObj);
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in getCountryById in countries file while trying to fetch country by id for updation. ${error.message}`,
      data: {},
    });
  }
};

module.exports.deleteCountry = async (req, res) => {
  if (!req?.body?.countryID || req.body.countryID === "") {
    res.json({
      status: "error",
      message: "Country id is required in url.",
      data: {},
    });
    return;
  }
  try {
    const countryID = req.body.countryID;
    const foundDataObj = await CountriesUtility.getCountryByIdUtil({
      countryID,
    });
    if (foundDataObj?.status === "success") {
      CountriesUtility.deleteCountryDataUtil({ res, countryID });
    } else {
      res.json(foundDataObj);
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in getCountryById in countries file while trying to fetch country by id for deletion. ${error.message}`,
      data: {},
    });
  }
};
