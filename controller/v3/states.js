const StatesUtility = require("../../utilities/v3/statesUtility");

module.exports.getAllStates = async (req, res) => {
  try {
    const foundDataObject = await StatesUtility.getAllStatesUtil({ req });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: [],
    });
  }
};

module.exports.getStateById = async (req, res) => {
  if (!req?.body?.stateID || req.body.stateID === "") {
    res.json({
      status: "error",
      message: "State id is required in url.",
      data: {},
    });
    return;
  }
  try {
    const stateID = req.body.stateID;
    const foundDataObj = await StatesUtility.getStateByIdUtil({
      stateID,
    });
    res.json(foundDataObj);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in getStateById in states file. ${error.message}`,
      data: {},
    });
  }
};

module.exports.addState = async (req, res) => {
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

  const foundStateRespByTitle = await StatesUtility.getStateByStateTitle({
    stateTitle: req.body.title,
  });
  if (foundStateRespByTitle?.status === "success") {
    res.json({
      status: foundStateRespByTitle.status,
      message: `State cannot be added as state with state title ${req.body.title} already exists.`,
      data: foundStateRespByTitle.data,
    });
    return;
  }

  StatesUtility.addNewStateUtil({ req, res });
};

module.exports.updateState = async (req, res) => {
  if (!req?.body?.id || req.body.id === "") {
    res.json({
      status: "error",
      message: "Id is required.",
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
    const stateID = req.body.id;
    const foundDataObj = await StatesUtility.getStateByIdUtil({
      stateID,
    });
    if (foundDataObj?.status === "success") {
      StatesUtility.updateStateUtil({ req, res });
    } else {
      res.json(foundDataObj);
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in getStateByIdUtil in states file while trying to fetch state by id for updation. ${error.message}`,
      data: {},
    });
  }
};

module.exports.deleteState = async (req, res) => {
  if (!req?.body?.stateID || req.body.stateID === "") {
    res.json({
      status: "error",
      message: "State id is required in url.",
      data: {},
    });
    return;
  }
  try {
    const stateID = req.body.stateID;
    const foundDataObj = await StatesUtility.getStateByIdUtil({
      stateID,
    });
    if (foundDataObj?.status === "success") {
      StatesUtility.deleteStateDataUtil({ res, stateID });
    } else {
      res.json(foundDataObj);
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occured in getStateByIdUtil in states file while trying to fetch state by id for deletion. ${error.message}`,
      data: {},
    });
  }
};

module.exports.getStatesByCountryId = async (req, res) => {
  if (!req?.body?.countryID || req.body.countryID === "") {
    res.json({
      status: "error",
      message: "Country id is required in url.",
      data: {},
    });
    return;
  }
  try {
    const allStatesRespDataObject = await StatesUtility.getAllStatesUtil({
      req,
    });
    if (allStatesRespDataObject?.status === "success") {
      const statesByCountryIdRespObject =
        await StatesUtility.getStateByCountryIdUtil({
          allStatesRespDataObject,
          req,
        });
      res.json(statesByCountryIdRespObject);
    } else {
      res.json(allStatesRespDataObject);
    }
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred in getAllStatesUtil function in getStatesByCountryId. ${error.message}`,
      data: [],
    });
  }
};
