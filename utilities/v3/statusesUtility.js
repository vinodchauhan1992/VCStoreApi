const StatusesSchema = require("../../model/v3/statuses");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");

module.exports.getAllStatusesUtil = async ({ req }) => {
  return await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: StatusesSchema,
    schemaName: "Statuses",
  });
};

module.exports.getStatusByIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Status id is required.",
      data: {},
    };
  }

  const statusID = req.body.id;

  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: StatusesSchema,
    schemaName: "Status",
    dataID: statusID,
  });
};

module.exports.addNewStatusUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: "Status title is required.",
      data: {},
    };
  }

  const statusID = CommonUtility.getUniqueID();
  const statusTitle = req.body.title;
  const dateAdded = new Date();
  const dateModified = new Date();

  const foundStatusByTitleObject =
    await CommonApisUtility.getDataByTitleFromSchemaUtil({
      schema: StatusesSchema,
      schemaName: "Status",
      dataTitle: statusTitle,
    });
  if (foundStatusByTitleObject?.status === "success") {
    return {
      status: "error",
      message: `Status with title "${statusTitle}" already exists.`,
      data: {},
    };
  }

  const newStatusSchema = StatusesSchema({
    id: statusID,
    title: statusTitle,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newStatusSchema,
    schemaName: "Status",
  });
};

module.exports.updateStatusUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Status id is required.",
      data: {},
    };
  }
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: "Status title is required.",
      data: {},
    };
  }

  const statusID = req.body.id;
  const statusTitle = req.body.title;
  const dateModified = new Date();

  const foundStatusIdObject = await this.getStatusByIDUtil({ req });
  if (foundStatusIdObject?.status === "error") {
    return foundStatusIdObject;
  }

  const foundStatusTitleObject =
    await CommonApisUtility.getDataByTitleFromSchemaUtil({
      schema: StatusesSchema,
      schemaName: "Status",
      dataTitle: statusTitle,
    });
  if (
    foundStatusTitleObject?.status === "success" &&
    foundStatusTitleObject?.data?.id !== statusID
  ) {
    return {
      status: "error",
      message: `Another status with same title "${statusTitle}" already exists. Please add a different status`,
      data: {},
    };
  }

  const newStatus = {
    id: statusID,
    title: statusTitle,
    dateModified: dateModified,
  };

  const updatedStatusSet = {
    $set: newStatus,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: StatusesSchema,
    newDataObject: newStatus,
    updatedDataSet: updatedStatusSet,
    schemaName: "Status",
    dataID: statusID,
  });
};

module.exports.deleteStatusUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Status id is required.",
      data: {},
    };
  }

  const statusID = req.body.id;

  const foundStatusIdObject = await this.getStatusByIDUtil({ req });
  if (foundStatusIdObject?.status === "error") {
    return foundStatusIdObject;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: StatusesSchema,
    schemaName: "Status",
    dataID: statusID,
  });
};
