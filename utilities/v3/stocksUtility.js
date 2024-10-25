const StocksSchema = require("../../model/v3/stocks");
const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");

module.exports.getAllProductStocksUtil = async ({ req }) => {
  return await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: StocksSchema,
    schemaName: "Stocks",
    arrSortByKey: "stockNumber",
  });
};

module.exports.getProductStockByStockIdUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Stock id is required.`,
      data: {},
    };
  }

  const stockID = req.body.id;
  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: StocksSchema,
    schemaName: "Stock",
    dataID: stockID,
  });
};

module.exports.getProductStockByProductIdUtil = async ({ req }) => {
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Product id is required.`,
      data: {},
    };
  }

  const productID = req.body.productID;
  const stockByIDObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: StocksSchema,
    schemaName: "Stock",
    dataID: productID,
    keyname: "productID",
  });

  if (stockByIDObj?.status === "error") {
    return {
      ...stockByIDObj,
      message: `Stock with product id ${productID} not found.`,
    };
  }
  return {
    ...stockByIDObj,
    message: `Stock with product id ${productID} found successfully.`,
  };
};

module.exports.getNewStockNumberUtil = async ({ req }) => {
  const allProductStocksObj = await this.getAllProductStocksUtil({ req });
  const dataArr = allProductStocksObj?.data ?? [];

  let currentMaxStockNumber = 0;

  if (dataArr && dataArr.length > 0) {
    const stockNumbersArr = [];
    dataArr.map((stockData) => {
      stockNumbersArr.push(stockData.stockNumber);
    });
    const maxStockNumber = stockNumbersArr.reduce(function (prev, current) {
      return prev && prev > current ? prev : current;
    });
    if (maxStockNumber) {
      currentMaxStockNumber = maxStockNumber ?? 0;
    }
  }
  const newStockNumber = currentMaxStockNumber + 1;
  return newStockNumber;
};

module.exports.addNewProductStockUtil = async ({ req }) => {
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Product id is required.`,
      data: {},
    };
  }
  if (
    req?.body?.quantityAvailable === undefined ||
    req.body.quantityAvailable === null ||
    req.body.quantityAvailable === ""
  ) {
    return {
      status: "error",
      message: `Available quantity is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.quantityAvailable)) {
    return {
      status: "error",
      message: `Available quantity must be a number.`,
      data: {},
    };
  }

  const newStockNumber = await this.getNewStockNumberUtil({ req });

  const stockID = CommonUtility.getUniqueID();
  const productID = req.body.productID;
  const paddedNewStockNumber = String(newStockNumber).padStart(9, "0");
  const stockCode = `Stock${paddedNewStockNumber}`;
  const quantityAvailable = req.body.quantityAvailable;
  const quantitySold = 0;
  const dateAdded = new Date();
  const dateModified = new Date();

  const foundStockByProductIDObj = await this.getProductStockByProductIdUtil({
    req: req,
  });

  if (foundStockByProductIDObj?.status === "success") {
    return {
      status: "error",
      message: `Product stock with product id ${productID} is already exists. Please update the existing one.`,
      data: {},
    };
  }

  const newProductStockSchema = new StocksSchema({
    id: stockID,
    stockNumber: newStockNumber,
    code: stockCode,
    productID: productID,
    quantityAvailable: quantityAvailable,
    quantitySold: quantitySold,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newProductStockSchema,
    schemaName: "Stock",
  });
};

module.exports.deleteProductStockUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Stock id is required.`,
      data: {},
    };
  }

  const stockID = req.body.id;

  const foundStockByStockIDObj = await this.getProductStockByStockIdUtil({
    req: req,
  });

  if (foundStockByStockIDObj?.status === "error") {
    return foundStockByStockIDObj;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: StocksSchema,
    schemaName: "Stock",
    dataID: stockID,
  });
};

module.exports.updateDataInProductStockTableUtil = async ({
  newDataObject,
  updatedDataSet,
  stockID,
}) => {
  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: StocksSchema,
    newDataObject: newDataObject,
    updatedDataSet: updatedDataSet,
    schemaName: "Stock",
    dataID: stockID,
  });
};

module.exports.updateProductStockUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Stock id is required.`,
      data: {},
    };
  }
  if (
    req?.body?.quantityAvailable === undefined ||
    req.body.quantityAvailable === null ||
    req.body.quantityAvailable === ""
  ) {
    return {
      status: "error",
      message: `Available quantity is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.quantityAvailable)) {
    return {
      status: "error",
      message: `Available quantity must be a number.`,
      data: {},
    };
  }

  const stockID = req.body.id;

  const foundStockByStockIDObj = await this.getProductStockByStockIdUtil({
    req: req,
  });

  if (foundStockByStockIDObj?.status === "error") {
    return foundStockByStockIDObj;
  }

  const quantityAvailable = foundStockByStockIDObj?.data?.quantityAvailable
    ? Number(foundStockByStockIDObj.data.quantityAvailable) +
      Number(req.body.quantityAvailable)
    : req.body.quantityAvailable;
  const dateModified = new Date();

  const newStock = {
    id: stockID,
    quantityAvailable: quantityAvailable,
    dateModified: dateModified,
  };

  const updatedStockSet = {
    $set: newStock,
  };

  return await this.updateDataInProductStockTableUtil({
    newDataObject: newStock,
    updatedDataSet: updatedStockSet,
    stockID: stockID,
  });
};
