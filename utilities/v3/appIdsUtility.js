const AppIdsSchema = require("../../model/v3/appIds");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");

module.exports.getAllAppIdsUtil = async ({ req }) => {
  return await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: AppIdsSchema,
    schemaName: "AppIds",
  });
};

module.exports.getAppIdByAppIdUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `AppId is required.`,
      data: {},
    };
  }
  const appID = req.body.id;
  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: AppIdsSchema,
    schemaName: "AppId",
    dataID: appID,
  });
};

module.exports.getAppIdByAppTitleUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: `AppId title is required.`,
      data: {},
    };
  }
  const appTitle = req.body.title;
  return await CommonApisUtility.getDataByTitleFromSchemaUtil({
    schema: AppIdsSchema,
    schemaName: "AppId",
    dataTitle: appTitle,
  });
};

module.exports.addNewAppIdEntryUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: `Title is required.`,
      data: {},
    };
  }

  const appTitle = req.body.title;
  const foundAppIdByTitleObj = await this.getAppIdByAppTitleUtil({ req });
  if (foundAppIdByTitleObj?.status === "success") {
    return {
      status: "error",
      message: `Another app id is already registered with the same title "${appTitle}"`,
      data: {},
    };
  }

  const newAppIdSchema = new AppIdsSchema({
    id: CommonUtility.getUniqueID(),
    title: req.body.title,
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newAppIdSchema,
    schemaName: "AppId",
  });
};

module.exports.updateAppIdEntryUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `AppId is required.`,
      data: {},
    };
  }
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: `Title is required.`,
      data: {},
    };
  }

  const appID = req.body.id;
  const appTitle = req.body.title;

  const foundAppIdByAppIdObj = await this.getAppIdByAppIdUtil({ req });
  if (foundAppIdByAppIdObj?.status === "error") {
    return foundAppIdByAppIdObj;
  }

  const foundAppIdByTitleObj = await this.getAppIdByAppTitleUtil({ req });
  if (
    foundAppIdByTitleObj?.status === "success" &&
    foundAppIdByAppIdObj?.id !== appID
  ) {
    return {
      status: "error",
      message: `Another app id is already registered with the same title "${appTitle}"`,
      data: {},
    };
  }

  const newAppId = {
    id: appID,
    title: appTitle,
    dateModified: new Date(),
  };

  const updatedAppIdSet = {
    $set: newAppId,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: AppIdsSchema,
    newDataObject: newAppId,
    updatedDataSet: updatedAppIdSet,
    schemaName: "AppId",
    dataID: appID,
  });
};

module.exports.deleteAppIdEntryUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `AppId is required.`,
      data: {},
    };
  }

  const appID = req.body.id;

  const foundAppIdByAppIdObj = await this.getAppIdByAppIdUtil({ req });
  if (foundAppIdByAppIdObj?.status === "error") {
    return foundAppIdByAppIdObj;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: AppIdsSchema,
    schemaName: "AppId",
    dataID: appID,
  });
};
