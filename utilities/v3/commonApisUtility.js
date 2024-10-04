const CommonUtility = require("./commonUtility");

module.exports.getAllDataFromSchemaUtil = async ({
  req,
  schema,
  schemaName,
}) => {
  const limit = req?.body?.limit ? Number(req.body.limit) : 0;
  const sort = req.body.sort == "desc" ? -1 : 1;

  return await schema
    .find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((allData) => {
      if (allData && allData.length > 0) {
        return {
          status: "success",
          message: `${schemaName} fetched successfully.`,
          data: CommonUtility.sortObjectsOfArray(allData),
        };
      } else {
        return {
          status: "success",
          message: `${schemaName} fetched successfully. But ${schemaName?.toLowerCase()} doesn't have any data.`,
          data: [],
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getAllDataFromSchemaUtil function while fetching ${schemaName} data. ${err.message}`,
        data: [],
      };
    });
};

module.exports.getDataByIdFromSchemaUtil = async ({
  schema,
  schemaName,
  dataID,
}) => {
  return await schema
    .findOne({
      id: dataID,
    })
    .select(["-_id"])
    .then((dataByID) => {
      if (dataByID && Object.keys(dataByID).length > 0) {
        return {
          status: "success",
          message: `${schemaName} with ${schemaName?.toLowerCase()} id ${dataID} fetched successfully.`,
          data: CommonUtility.sortObject(dataByID),
        };
      } else {
        return {
          status: "error",
          message: `There is no ${schemaName?.toLowerCase()} exists with ${schemaName?.toLowerCase()} id ${dataID}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getDataByIdFromSchemaUtil function while fetching ${schemaName} data by id ${dataID}. ${err.message}`,
        data: {},
      };
    });
};

module.exports.getDataByTitleFromSchemaUtil = async ({
  schema,
  schemaName,
  dataTitle,
}) => {
  return await schema
    .findOne({
      title: dataTitle,
    })
    .select(["-_id"])
    .then((dataByTitle) => {
      if (dataByTitle && Object.keys(dataByTitle).length > 0) {
        return {
          status: "success",
          message: `${schemaName} with ${schemaName?.toLowerCase()} title ${dataTitle} fetched successfully.`,
          data: CommonUtility.sortObject(dataByTitle),
        };
      } else {
        return {
          status: "error",
          message: `There is no ${schemaName?.toLowerCase()} exists with ${schemaName?.toLowerCase()} title ${dataTitle}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getDataByTitleFromSchemaUtil function while fetching ${schemaName} data by title ${dataTitle}. ${err.message}`,
        data: {},
      };
    });
};

module.exports.getDataByCodeFromSchemaUtil = async ({
  schema,
  schemaName,
  dataCode,
}) => {
  return await schema
    .findOne({
      code: dataCode,
    })
    .select(["-_id"])
    .then((dataByTitle) => {
      if (dataByTitle && Object.keys(dataByTitle).length > 0) {
        return {
          status: "success",
          message: `${schemaName} with ${schemaName?.toLowerCase()} code ${dataCode} fetched successfully.`,
          data: CommonUtility.sortObject(dataByTitle),
        };
      } else {
        return {
          status: "error",
          message: `There is no ${schemaName?.toLowerCase()} exists with ${schemaName?.toLowerCase()} code ${dataCode}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getDataByCodeFromSchemaUtil function while fetching ${schemaName} data by code ${dataCode}. ${err.message}`,
        data: {},
      };
    });
};

module.exports.addNewDataToSchemaUtil = async ({ newSchema, schemaName }) => {
  return await newSchema
    .save()
    .then((respondedData) => {
      if (respondedData && Object.keys(respondedData).length > 0) {
        return {
          status: "success",
          message: `New ${schemaName?.toLowerCase()} is added successfully.`,
          data: CommonUtility.sortObject(respondedData),
        };
      } else {
        return {
          status: "error",
          message: `${schemaName} is not added due to unknown error.`,
          data: {},
        };
      }
    })
    .catch((error) => {
      return {
        status: "error",
        message: `There is an error occurred in addNewDataToSchemaUtil function while adding new ${schemaName?.toLowerCase()}. ${
          error.message
        }`,
        data: {},
      };
    });
};

module.exports.deleteDataByIdFromSchemaUtil = async ({
  schema,
  schemaName,
  dataID,
}) => {
  return await schema
    .deleteOne({
      id: dataID,
    })
    .select(["-_id"])
    .then((result) => {
      if (result && result.deletedCount === 1) {
        return {
          status: "success",
          message: `${schemaName} with ${schemaName?.toLowerCase()} id ${dataID} is deleted successfully.`,
          data: {},
        };
      } else {
        return {
          status: "error",
          message: `${schemaName} with ${schemaName?.toLowerCase()} id ${dataID} is not deleted.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in deleteDataByIdFromSchemaUtil function while deleting the ${schemaName?.toLowerCase()} using ${schemaName?.toLowerCase()} id. ${
          err.message
        }`,
        data: {},
      };
    });
};

module.exports.updateDataInSchemaUtil = async ({
  schema,
  newDataObject,
  updatedDataSet,
  schemaName,
  dataID,
}) => {
  return await schema
    .updateOne({ id: dataID }, updatedDataSet)
    .then((respondedData) => {
      if (respondedData && Object.keys(respondedData).length > 0) {
        return {
          status: "success",
          message: `${schemaName} with ${schemaName?.toLowerCase()} id "${dataID}" is updated successfully.`,
          data: newDataObject,
        };
      } else {
        return {
          status: "error",
          message: `${schemaName} with ${schemaName?.toLowerCase()} id "${dataID}" is not updated due to unknown error.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in updateDataInSchemaUtil function while updating ${schemaName?.toLowerCase()} with ${schemaName?.toLowerCase()} id "${dataID}". ${
          err.message
        }`,
        data: {},
      };
    });
};
