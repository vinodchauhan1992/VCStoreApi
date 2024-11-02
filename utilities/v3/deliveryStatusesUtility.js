const DeliveryStatusesSchema = require("../../model/v3/deliveryStatuses");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");

module.exports.getAllDeliveryStatusesUtil = async ({ req }) => {
  return await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: DeliveryStatusesSchema,
    schemaName: "Delivery Statuses",
    arrSortByKey: "deliveryStatusNumber",
  });
};

module.exports.getDeliveryStatusByIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Delivery status id is required.`,
      data: {},
    };
  }

  const deliveryStatusID = req.body.id;

  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: DeliveryStatusesSchema,
    schemaName: "Delivery Status",
    dataID: deliveryStatusID,
  });
};

module.exports.getDeliveryStatusByTitleUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: `Delivery status title is required.`,
      data: {},
    };
  }

  const deliveryStatusTitle = req.body.title;

  return await CommonApisUtility.getDataByTitleFromSchemaUtil({
    schema: DeliveryStatusesSchema,
    schemaName: "Delivery Status",
    dataTitle: deliveryStatusTitle,
  });
};

module.exports.getDeliveryStatusByCodeUtil = async ({ req }) => {
  if (!req?.body?.code || req.body.code === "") {
    return {
      status: "error",
      message: `Delivery status code is required.`,
      data: {},
    };
  }

  const deliveryStatusCode = req.body.code;

  return await CommonApisUtility.getDataByCodeFromSchemaUtil({
    schema: DeliveryStatusesSchema,
    schemaName: "Delivery Status",
    dataCode: deliveryStatusCode,
  });
};

module.exports.getNewDeliveryStatusNumberUtil = async ({ req }) => {
  const allItemsObj = await this.getAllDeliveryStatusesUtil({
    req,
  });
  const dataArr = allItemsObj?.data ?? [];

  let currentMaxItemNumber = 0;

  if (dataArr && dataArr.length > 0) {
    const itemNumbersArr = [];
    dataArr.map((item) => {
      itemNumbersArr.push(item.deliveryStatusNumber);
    });
    const maxItemNumber = itemNumbersArr.reduce(function (prev, current) {
      return prev && prev > current ? prev : current;
    });
    if (maxItemNumber) {
      currentMaxItemNumber = maxItemNumber ?? 0;
    }
  }
  const newItemNumber = currentMaxItemNumber + 1;
  return newItemNumber;
};

module.exports.addNewDeliveryStatusUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: `Delivery status title is required.`,
      data: {},
    };
  }

  const deliveryStatusTitle = req.body.title;
  const newDeliveryStatusNumber = await this.getNewDeliveryStatusNumberUtil({
    req,
  });
  const paddedNewDeliveryStatusNumber = String(
    newDeliveryStatusNumber
  ).padStart(9, "0");
  const code = `DS${paddedNewDeliveryStatusNumber}`;
  const deliveryStatusID = CommonUtility.getUniqueID();
  const dateAdded = new Date();
  const dateModified = new Date();

  const foundDataByTitle = await this.getDeliveryStatusByTitleUtil({
    req: req,
  });
  if (foundDataByTitle?.status === "success") {
    return {
      status: "error",
      message: `Delivery status with title ${deliveryStatusTitle} is already exists.`,
      data: {},
    };
  }

  const newDeliveryStatusSchema = new DeliveryStatusesSchema({
    id: deliveryStatusID,
    deliveryStatusNumber: newDeliveryStatusNumber,
    code: code,
    title: deliveryStatusTitle,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newDeliveryStatusSchema,
    schemaName: "Delivery Status",
  });
};

module.exports.updateDeliveryStatusUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Delivery status id is required.`,
      data: {},
    };
  }
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: `Delivery status title is required.`,
      data: {},
    };
  }

  const deliveryStatusID = req.body.id;
  const deliveryStatusTitle = req.body.title;
  const dateModified = new Date();

  const foundDataByID = await this.getDeliveryStatusByIDUtil({ req: req });
  if (foundDataByID?.status === "error") {
    return foundDataByID;
  }

  const foundDataByTitle = await this.getDeliveryStatusByTitleUtil({
    req: req,
  });
  if (
    foundDataByTitle?.status === "success" &&
    foundDataByTitle?.data?.title === deliveryStatusTitle &&
    foundDataByTitle?.data?.id !== deliveryStatusID
  ) {
    return {
      status: "error",
      message: `Another delivery status with same title ${deliveryStatusTitle} already exists.`,
      data: {},
    };
  }

  const newDeliveryStatus = {
    id: deliveryStatusID,
    title: deliveryStatusTitle,
    dateModified: dateModified,
  };

  const updatedDeliveryStatusSet = {
    $set: newDeliveryStatus,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: DeliveryStatusesSchema,
    newDataObject: newDeliveryStatus,
    updatedDataSet: updatedDeliveryStatusSet,
    schemaName: "Delivery Status",
    dataID: deliveryStatusID,
  });
};

module.exports.deleteDeliveryStatusUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Delivery status id is required.`,
      data: {},
    };
  }

  const deliveryStatusID = req.body.id;

  const foundDataByID = await this.getDeliveryStatusByIDUtil({ req: req });
  if (foundDataByID?.status === "error") {
    return foundDataByID;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: DeliveryStatusesSchema,
    schemaName: "Delivery Status",
    dataID: deliveryStatusID,
  });
};
