const CitiesUtility = require("../../utilities/v3/citiesUtility");

module.exports.getAllCities = async (req, res) => {
  try {
    const foundDataObject = await CitiesUtility.getAllCitiesUtil({ req });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: [],
    });
  }
};

module.exports.getCityById = async (req, res) => {
  if (!req?.params?.cityID || req.params.cityID === "") {
    res.json({
      status: "error",
      message: "City id is required in url.",
      data: {},
    });
    return;
  }
  try {
    const cityID = req.params.cityID;
    const foundDataObj = await CitiesUtility.getCityByIdUtil({
      cityID,
    });
    res.json(foundDataObj);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in getCityById in cities file. ${error.message}`,
      data: {},
    });
  }
};

module.exports.addCity = async (req, res) => {
  if (!req?.body?.countryID || req.body.countryID === "") {
    res.json({
      status: "error",
      message: "Country id is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.stateID || req.body.stateID === "") {
    res.json({
      status: "error",
      message: "State id is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.title || req.body.title === "") {
    res.json({
      status: "error",
      message: "State title is required.",
      data: {},
    });
    return;
  }
  if (req?.body?.isDeleteable === undefined || req.body.isDeleteable === null) {
    res.json({
      status: "error",
      message: "Deleteable flag is required.",
      data: {},
    });
    return;
  }
  if (
    req?.body?.isAdminDeleteable === undefined ||
    req.body.isAdminDeleteable === null
  ) {
    res.json({
      status: "error",
      message: "Admin deleteable flag is required.",
      data: {},
    });
    return;
  }

  const foundStateRespByTitle = await CitiesUtility.getCityByCityTitle({
    cityTitle: req.body.title,
  });
  if (foundStateRespByTitle?.status === "success") {
    res.json({
      status: foundStateRespByTitle.status,
      message: `City cannot be added as city with city title ${req.body.title} already exists.`,
      data: foundStateRespByTitle.data,
    });
    return;
  }

  CitiesUtility.addNewCityUtil({ req, res });
};

module.exports.updateCity = async (req, res) => {
  if (!req?.params?.cityID || req.params.cityID === "") {
    res.json({
      status: "error",
      message: "City id is required in url.",
      data: {},
    });
    return;
  }
  if (!req?.body?.id || req.body.id === "") {
    res.json({
      status: "error",
      message: "Id is required in body.",
      data: {},
    });
    return;
  }
  if (!req?.body?.stateID || req.body.stateID === "") {
    res.json({
      status: "error",
      message: "State id is required.",
      data: {},
    });
    return;
  }
  if (!req?.body?.countryID || req.body.countryID === "") {
    res.json({
      status: "error",
      message: "Country id is required.",
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
  if (req?.body?.isDeleteable === undefined || req.body.isDeleteable === null) {
    res.json({
      status: "error",
      message: "Deleteable flag is required.",
      data: {},
    });
    return;
  }
  if (
    req?.body?.isAdminDeleteable === undefined ||
    req.body.isAdminDeleteable === null
  ) {
    res.json({
      status: "error",
      message: "Admin deleteable flag is required.",
      data: {},
    });
    return;
  }
  try {
    const cityID = req.params.cityID;
    const foundDataObj = await CitiesUtility.getCityByIdUtil({
      cityID,
    });
    if (foundDataObj?.status === "success") {
      CitiesUtility.updateCityUtil({ req, res });
    } else {
      res.json(foundDataObj);
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in getCityByIdUtil in cities file while trying to fetch city by id for updation. ${error.message}`,
      data: {},
    });
  }
};

module.exports.deleteCity = async (req, res) => {
  if (!req?.params?.cityID || req.params.cityID === "") {
    res.json({
      status: "error",
      message: "State id is required in url.",
      data: {},
    });
    return;
  }
  try {
    const cityID = req.params.cityID;
    const foundDataObj = await CitiesUtility.getCityByIdUtil({
      cityID,
    });
    if (foundDataObj?.status === "success") {
      CitiesUtility.deleteCityDataUtil({ res, cityID });
    } else {
      res.json(foundDataObj);
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in getCityByIdUtil in cities file while trying to fetch city by id for deletion. ${error.message}`,
      data: {},
    });
  }
};

module.exports.getCitiesByStateId = async (req, res) => {
  if (!req?.params?.stateID || req.params.stateID === "") {
    res.json({
      status: "error",
      message: "State id is required in url.",
      data: {},
    });
    return;
  }
  try {
    const allCitiesRespDataObject = await CitiesUtility.getAllCitiesUtil({
      req,
    });
    if (allCitiesRespDataObject?.status === "success") {
      const citiesByStateIdRespObject =
        await CitiesUtility.getCitiesByStateIdUtil({
          allCitiesRespDataObject,
          req,
        });
      res.json(citiesByStateIdRespObject);
    } else {
      res.json(citiesByStateIdRespObject);
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred in getAllCitiesUtil function in getCitiesByStateId. ${error.message}`,
      data: [],
    });
  }
};

module.exports.getCitiesByCountryId = async (req, res) => {
  if (!req?.params?.countryID || req.params.countryID === "") {
    res.json({
      status: "error",
      message: "Country id is required in url.",
      data: {},
    });
    return;
  }
  try {
    const allCitiesRespDataObject = await CitiesUtility.getAllCitiesUtil({
      req,
    });
    if (allCitiesRespDataObject?.status === "success") {
      const citiesByCountryIdRespObject =
        await CitiesUtility.getCitiesByCountryIdUtil({
          allCitiesRespDataObject,
          req,
        });
      res.json(citiesByCountryIdRespObject);
    } else {
      res.json(citiesByCountryIdRespObject);
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred in getAllCitiesUtil function in getCitiesByCountryId. ${error.message}`,
      data: [],
    });
  }
};
