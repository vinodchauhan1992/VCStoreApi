const StocksSchema = require("../../model/v3/stocks");
const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");
const ProductsUtility = require("./productsUtility");

module.exports.getProductDataByProductIDUtil = async ({ productID }) => {
  const foundObj = await ProductsUtility.getProductByProductIDUtil({
    req: {
      body: {
        id: productID,
      },
    },
  });

  if (
    foundObj?.status === "success" &&
    foundObj?.data &&
    Object.keys(foundObj.data).length > 0
  ) {
    return foundObj;
  }

  return {
    ...foundObj,
    data: { id: productID },
  };
};

module.exports.getSingleStockWithAllDetailsUtil = async ({ stockData }) => {
  const productByProductIdObject = await this.getProductDataByProductIDUtil({
    productID: stockData?.productID,
  });

  return {
    id: stockData?.id ?? "",
    stockNumber: stockData?.stockNumber,
    code: stockData?.code ?? "",
    productDetails: productByProductIdObject?.data,
    quantityAvailable: stockData?.quantityAvailable ?? 0,
    quantitySold: stockData?.quantitySold ?? 0,
    dateAdded: stockData?.dateAdded ?? new Date(),
    dateModified: stockData?.dateModified ?? new Date(),
  };
};

module.exports.getAllStocksArrWithAllDetailsUtil = async ({ allStocksArr }) => {
  return Promise.all(
    allStocksArr?.map(async (stockData) => {
      const stockDetailsData = await this.getSingleStockWithAllDetailsUtil({
        stockData: stockData,
      });
      return stockDetailsData;
    })
  );
};

module.exports.getAllProductStocksUtil = async ({ req }) => {
  const foundDataObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: StocksSchema,
    schemaName: "Stocks",
    arrSortByKey: "stockNumber",
  });
  if (foundDataObj?.status === "error") {
    return foundDataObj;
  }
  if (
    foundDataObj?.status === "success" &&
    (!foundDataObj?.data || foundDataObj.data.length <= 0)
  ) {
    return {
      status: "error",
      message: `Stock data not found.`,
      data: [],
    };
  }

  const fullDetailsDataArr = await this.getAllStocksArrWithAllDetailsUtil({
    allStocksArr: foundDataObj.data,
  });

  return {
    ...foundDataObj,
    data: fullDetailsDataArr,
  };
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
  const foundDataObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: StocksSchema,
    schemaName: "Stock",
    dataID: stockID,
  });
  if (foundDataObj?.status === "error") {
    return foundDataObj;
  }

  const fullDetailsData = await this.getSingleStockWithAllDetailsUtil({
    stockData: foundDataObj?.data,
  });

  return {
    ...foundDataObj,
    data: fullDetailsData,
  };
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

  const fullDetailsData = await this.getSingleStockWithAllDetailsUtil({
    stockData: stockByIDObj?.data,
  });

  return {
    ...stockByIDObj,
    message: `Stock with product id ${productID} found successfully.`,
    data: fullDetailsData,
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

  const addedNewObj = await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newProductStockSchema,
    schemaName: "Stock",
  });

  const fullDetailsData = await this.getSingleStockWithAllDetailsUtil({
    stockData: addedNewObj?.data,
  });

  return {
    ...addedNewObj,
    data: fullDetailsData,
  };
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

  const quantityAvailable = Number(req.body.quantityAvailable);
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
