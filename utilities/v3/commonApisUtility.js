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
  keyname,
}) => {
  const updateKeyName = keyname && keyname !== "" ? keyname : "id";
  return await schema
    .findOne({
      [updateKeyName]: dataID,
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
  keyname,
}) => {
  const updateKeyName = keyname && keyname !== "" ? keyname : "code";
  return await schema
    .findOne({
      [updateKeyName]: dataCode,
    })
    .select(["-_id"])
    .then((dataByCode) => {
      if (dataByCode && Object.keys(dataByCode).length > 0) {
        return {
          status: "success",
          message: `${schemaName} with ${schemaName?.toLowerCase()} code ${dataCode} fetched successfully.`,
          data: CommonUtility.sortObject(dataByCode),
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

module.exports.getDataByEmailFromSchemaUtil = async ({
  schema,
  schemaName,
  emailID,
}) => {
  return await schema
    .findOne({
      email: emailID,
    })
    .select(["-_id"])
    .then((dataByEmail) => {
      if (dataByEmail && Object.keys(dataByEmail).length > 0) {
        return {
          status: "success",
          message: `${schemaName} with ${schemaName?.toLowerCase()} email ${emailID} fetched successfully.`,
          data: CommonUtility.sortObject(dataByEmail),
        };
      } else {
        return {
          status: "error",
          message: `There is no ${schemaName?.toLowerCase()} exists with ${schemaName?.toLowerCase()} email ${emailID}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getDataByEmailFromSchemaUtil function while fetching ${schemaName} data by email ${emailID}. ${err.message}`,
        data: {},
      };
    });
};

module.exports.getDataByPhoneFromSchemaUtil = async ({
  schema,
  schemaName,
  phone,
}) => {
  return await schema
    .findOne({
      phone: phone,
    })
    .select(["-_id"])
    .then((dataByPhone) => {
      if (dataByPhone && Object.keys(dataByPhone).length > 0) {
        return {
          status: "success",
          message: `${schemaName} with ${schemaName?.toLowerCase()} phone ${phone} fetched successfully.`,
          data: CommonUtility.sortObject(dataByPhone),
        };
      } else {
        return {
          status: "error",
          message: `There is no ${schemaName?.toLowerCase()} exists with ${schemaName?.toLowerCase()} phone ${phone}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getDataByEmailFromSchemaUtil function while fetching ${schemaName} data by phone ${phone}. ${err.message}`,
        data: {},
      };
    });
};

module.exports.getDataArrayByIdFromSchemaUtil = async ({
  schema,
  schemaName,
  dataID,
  keyname,
}) => {
  const updateKeyName = keyname && keyname !== "" ? keyname : "id";
  return await schema
    .find({
      [updateKeyName]: dataID,
    })
    .select(["-_id"])
    .then((dataArrayByID) => {
      if (dataArrayByID && dataArrayByID.length > 0) {
        return {
          status: "success",
          message: `${schemaName} with ${schemaName?.toLowerCase()} id ${dataID} fetched successfully.`,
          data: CommonUtility.sortObjectsOfArray(dataArrayByID),
        };
      } else {
        return {
          status: "error",
          message: `There is no ${schemaName?.toLowerCase()} exists with ${schemaName?.toLowerCase()} id ${dataID}.`,
          data: [],
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getDataArrayByIdFromSchemaUtil function while fetching ${schemaName} data by id ${dataID}. ${err.message}`,
        data: [],
      };
    });
};

module.exports.getDataArrayByCodeFromSchemaUtil = async ({
  schema,
  schemaName,
  dataCode,
  keyname,
}) => {
  const updateKeyName = keyname && keyname !== "" ? keyname : "code";
  return await schema
    .find({
      [updateKeyName]: dataCode,
    })
    .select(["-_id"])
    .then((dataArrayByCode) => {
      if (dataArrayByCode && dataArrayByCode.length > 0) {
        return {
          status: "success",
          message: `${schemaName} with ${schemaName?.toLowerCase()} code ${dataCode} fetched successfully.`,
          data: CommonUtility.sortObjectsOfArray(dataArrayByCode),
        };
      } else {
        return {
          status: "error",
          message: `There is no ${schemaName?.toLowerCase()} exists with ${schemaName?.toLowerCase()} code ${dataCode}.`,
          data: [],
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getDataArrayByCodeFromSchemaUtil function while fetching ${schemaName} data by code ${dataCode}. ${err.message}`,
        data: [],
      };
    });
};

module.exports.getDataByJwtTokenFromSchemaUtil = async ({
  schema,
  schemaName,
  jwtToken,
  keyname,
}) => {
  const updateKeyName = keyname && keyname !== "" ? keyname : "jwtToken";
  return await schema
    .findOne({
      [updateKeyName]: jwtToken,
    })
    .select(["-_id"])
    .then((dataByJwtToken) => {
      if (dataByJwtToken && Object.keys(dataByJwtToken).length > 0) {
        return {
          status: "success",
          message: `${schemaName} with ${schemaName?.toLowerCase()} jwtToken ${jwtToken} fetched successfully.`,
          data: CommonUtility.sortObject(dataByJwtToken),
        };
      } else {
        return {
          status: "error",
          message: `There is no ${schemaName?.toLowerCase()} exists with ${schemaName?.toLowerCase()} jwtToken ${jwtToken}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in getDataByJwtTokenFromSchemaUtil function while fetching ${schemaName} data by jwtToken ${jwtToken}. ${err.message}`,
        data: {},
      };
    });
};

module.exports.updateDataByJwtTokenInSchemaUtil = async ({
  schema,
  newDataObject,
  updatedDataSet,
  schemaName,
  jwtToken,
  keyname,
}) => {
  const updateKeyName = keyname && keyname !== "" ? keyname : "jwtToken";
  return await schema
    .updateOne({ [updateKeyName]: jwtToken }, updatedDataSet)
    .then((respondedData) => {
      if (respondedData && Object.keys(respondedData).length > 0) {
        return {
          status: "success",
          message: `${schemaName} with ${schemaName?.toLowerCase()} jwtToken "${jwtToken}" is updated successfully.`,
          data: newDataObject,
        };
      } else {
        return {
          status: "error",
          message: `${schemaName} with ${schemaName?.toLowerCase()} jwtToken "${jwtToken}" is not updated due to unknown error.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred in updateDataByJwtTokenInSchemaUtil function while updating ${schemaName?.toLowerCase()} with ${schemaName?.toLowerCase()} jwtToken "${jwtToken}". ${
          err.message
        }`,
        data: {},
      };
    });
};
