const GendersUtility = require("../../utilities/v3/gendersUtility");

module.exports.getAllGenders = async (req, res) => {
  try {
    const foundDataObject = await GendersUtility.getAllGendersUtil({ req });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: [],
    });
  }
};

module.exports.getGenderById = async (req, res) => {
  try {
    const foundDataObject = await GendersUtility.getGenderByIdUtil({ req });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: {},
    });
  }
};

module.exports.getGenderByGenderTitle = async (req, res) => {
  try {
    const foundDataObject = await GendersUtility.getGenderByGenderTitleUtil({
      req,
    });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: {},
    });
  }
};

module.exports.getGenderByGenderCode = async (req, res) => {
  try {
    const foundDataObject = await GendersUtility.getGenderByGenderCodeUtil({
      req,
    });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: {},
    });
  }
};

module.exports.addNewGender = async (req, res) => {
  try {
    const addedDataObject = await GendersUtility.addNewGenderUtil({
      req,
    });
    res.json(addedDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred in adding new gender. ${error.message}`,
      data: {},
    });
  }
};

module.exports.updateGender = async (req, res) => {
  try {
    const updatedDataObject = await GendersUtility.updateGenderUtil({
      req,
    });
    res.json(updatedDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred in updating gender. ${error.message}`,
      data: {},
    });
  }
};

module.exports.deleteGender = async (req, res) => {
  try {
    const deletedDataObject = await GendersUtility.deleteGenderDataUtil({
      req,
    });
    res.json(deletedDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred in deleting gender. ${error.message}`,
      data: {},
    });
  }
};
