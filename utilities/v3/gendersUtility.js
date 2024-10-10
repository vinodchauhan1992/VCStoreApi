const Genders = require("../../model/v3/genders");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");

module.exports.getAllGendersUtil = async ({ req }) => {
  return await CommonApisUtility.getAllDataFromSchemaUtil({
    req,
    schema: Genders,
    schemaName: "Genders",
  });
};

module.exports.getGenderByIdUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Gender id is required",
      data: {},
    };
  }

  const genderID = req.body.id;

  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: Genders,
    schemaName: "Gender",
    dataID: genderID,
  });
};

module.exports.getGenderByGenderTitleUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: "Gender title is required",
      data: {},
    };
  }

  const genderTitle = req.body.title;

  return await CommonApisUtility.getDataByTitleFromSchemaUtil({
    schema: Genders,
    schemaName: "Gender",
    dataTitle: genderTitle,
  });
};

module.exports.getGenderByGenderCodeUtil = async ({ req }) => {
  if (!req?.body?.code || req.body.code === "") {
    return {
      status: "error",
      message: "Gender code is required",
      data: {},
    };
  }

  const genderCode = req.body.code;

  return await CommonApisUtility.getDataByCodeFromSchemaUtil({
    schema: Genders,
    schemaName: "Gender",
    dataCode: genderCode,
  });
};

module.exports.addNewGenderUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: "Title is required.",
      data: {},
    };
  }

  const genderID = CommonUtility.getUniqueID();
  const genderTitle = req.body.title;
  const genderCode = req.body.title.toLowerCase();
  const dateAdded = new Date();
  const dateModified = new Date();

  const foundGenderDataByTitleResponse = await this.getGenderByGenderTitleUtil({
    req,
  });

  if (foundGenderDataByTitleResponse?.status === "success") {
    return {
      status: "error",
      message: `Gender with title "${genderTitle}" is already exists in database.`,
      data: {},
    };
  }

  const newGenderSchema = Genders({
    id: genderID,
    title: genderTitle,
    code: genderCode,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newGenderSchema,
    schemaName: "Gender",
  });
};

module.exports.deleteGenderDataUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Gender id is required.",
      data: {},
    };
  }

  const genderID = req.body.id;

  const foundGenderDataByIdResponse = await this.getGenderByIdUtil({
    req,
  });

  if (foundGenderDataByIdResponse?.status === "error") {
    return {
      status: "error",
      message: `Gender with gender id "${genderID}" does not exists in database.`,
      data: {},
    };
  }
  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: Genders,
    schemaName: "Gender",
    dataID: genderID,
  });
};

module.exports.updateGenderUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Gender id is required.",
      data: {},
    };
  }
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: "Title is required.",
      data: {},
    };
  }

  const genderID = req.body.id;
  const genderTitle = req.body.title;
  const genderCode = req.body.title.toLowerCase();
  const dateModified = new Date();

  const foundDataById = await this.getGenderByIdUtil({ req });
  if (foundDataById?.status === "error") {
    return foundDataById;
  }

  const foundDataByTitle = await this.getGenderByGenderTitleUtil({ req });
  if (
    foundDataByTitle?.status === "success" &&
    foundDataByTitle?.data?.id !== genderID
  ) {
    return {
      status: "error",
      message: `Gender can't be updated as gender with same title "${genderTitle}" already exists.`,
      data: {},
    };
  }

  const newGender = {
    id: genderID,
    title: genderTitle,
    code: genderCode,
    dateModified: dateModified,
  };

  const updatedGenderSet = {
    $set: newGender,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: Genders,
    newDataObject: newGender,
    updatedDataSet: updatedGenderSet,
    schemaName: "Gender",
    dataID: genderID,
  });
};
