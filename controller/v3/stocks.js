const Stocks = require("../../model/v3/stocks");
const CommonUtility = require("../../utilities/v3/commonUtility");
const StocksUtility = require("../../utilities/v3/stocksUtility");

module.exports.getAllProductStocks = async (req, res) => {
  try {
    const foundDataObject = await StocksUtility.getAllProductStocksData({
      req,
    });
    res.json(foundDataObject);
  } catch (error) {
    res.json({
      status: "error",
      message: `There is an error occurred. ${error.message}`,
      data: [],
    });
  }
};

module.exports.getProductStockByStockId = async (req, res) => {
  if (!req?.params?.stockID || req.params.stockID === "") {
    res.json({
      status: "error",
      message: "Product stock id should be provided",
      data: null,
    });
    return;
  }
  const stockID = req.params.stockID;

  const foundProductStockResponse =
    await StocksUtility.getProductStockDataByStockId({
      stockID,
    });
  res.json(foundProductStockResponse);
};

module.exports.getProductStockDataByProductId = async (req, res) => {
  if (!req?.params?.productID || req.params.productID === "") {
    res.json({
      status: "error",
      message: "Product id should be provided to get stock by product id",
      data: null,
    });
    return;
  }
  const productID = req.params.productID;

  const foundProductStockResponse =
    await StocksUtility.getProductStockDataByProductIdUtil({
      productID,
    });
  res.json(foundProductStockResponse);
};

module.exports.getProductStockDataByBrandId = async (req, res) => {
  if (!req?.params?.brandID || req.params.brandID === "") {
    res.json({
      status: "error",
      message: "Brand id should be provided to get stock by brand id",
      data: null,
    });
    return;
  }
  const brandID = req.params.brandID;

  const foundProductStockResponse =
    await StocksUtility.getProductStockDataByBrandIdUtil({
      brandID,
    });
  res.json(foundProductStockResponse);
};

module.exports.addProductStock = async (req, res) => {
  if (!req?.body?.productId || req.body.productId === "") {
    res.json({
      status: "error",
      message: "Product id is required",
      data: null,
    });
    return;
  }
  if (!req?.body?.brandId || req.body.brandId === "") {
    res.json({
      status: "error",
      message: "Brand id is required",
      data: null,
    });
    return;
  }
  if (
    req?.body?.quantityRecieved === undefined ||
    req?.body?.quantityRecieved === null
  ) {
    res.json({
      status: "error",
      message: "Quantity recieved is required",
      data: null,
    });
    return;
  }
  if (
    req?.body?.quantityAvailable === undefined ||
    req?.body?.quantityAvailable === null
  ) {
    res.json({
      status: "error",
      message: "Quantity available is required",
      data: null,
    });
    return;
  }
  const stockId = CommonUtility.getUniqueID();
  const productId = req.body.productId;
  const brandId = req.body.brandId;
  const quantityRecieved = req.body.quantityRecieved;
  const quantityAvailable = req.body.quantityAvailable;
  const totalQuantities = req.body.quantityRecieved;

  const newProductStockSchema = new Stocks({
    id: stockId,
    productId: productId,
    brandId: brandId,
    totalQuantities: totalQuantities,
    quantityRecieved: quantityRecieved,
    quantityAvailable: quantityAvailable,
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  StocksUtility.addNewProductStockUtil({
    productStockSchema: newProductStockSchema,
    res: res,
  });
};

module.exports.deleteProductStock = async (req, res) => {
  if (!req.params.stockID || req.params.stockID === "") {
    res.json({
      status: "error",
      message: "Stock id must be provided to delete a stock.",
      data: {},
    });
    return;
  }

  const stockID = req.params.stockID;

  const foundProductStockResponse =
    await StocksUtility.getProductStockDataByStockId({
      stockID,
    });

  if (foundProductStockResponse.status === "success") {
    await StocksUtility.deleteProductStockUtil({
      stockID: stockID,
      res: res,
    });
  } else {
    res.json({
      status: "error",
      message: `Product stock can't be deleted as product stock with stockID ${stockID} not found.`,
      data: {},
    });
  }
};

module.exports.updateProductStock = async (req, res) => {
  if (!req?.params?.stockID || req.body.stockID === "") {
    res.json({
      status: "error",
      message: "Stock id is required in url",
      data: null,
    });
    return;
  }
  if (
    req?.body?.quantityRecieved === undefined ||
    req?.body?.quantityRecieved === null
  ) {
    res.json({
      status: "error",
      message: "Quantity recieved is required",
      data: null,
    });
    return;
  }
  if (
    req?.body?.quantityAvailable === undefined ||
    req?.body?.quantityAvailable === null
  ) {
    res.json({
      status: "error",
      message: "Quantity available is required",
      data: null,
    });
    return;
  }

  const stockID = req.params.stockID;

  const foundProductStockResponse =
    await StocksUtility.getProductStockDataByStockId({
      stockID,
    });

  if (foundProductStockResponse.status === "success") {
    const alreadyAddedTotalQuantities =
      foundProductStockResponse?.data?.stockDetails?.totalQuantities ?? 0;
    try {
      StocksUtility.updateProductStockUtil({
        req,
        res,
        alreadyAddedTotalQuantities,
      });
    } catch (error) {
      res.json({
        status: "error",
        message: `Product stock can't be updated. There is an unknown error occured in updateProductStock function. ${error.message}`,
        data: null,
      });
    }
  } else {
    res.json({
      status: "error",
      message: `Product stock can't be updated as product stock with stock id ${stockID} not found.`,
      data: null,
    });
  }
};
