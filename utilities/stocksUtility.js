const Stocks = require("../model/stocks");
const CommonUtility = require("./commonUtility");

module.exports.getAllProductStocksWithDetails = async ({
  allProductStocks,
}) => {
  return Promise.all(
    allProductStocks?.map(async (productStockData) => {
      const foundProductObject =
        await CommonUtility.getProductDetailsByProductId({
          productId: productStockData.productId,
        });
      return {
        stockDetails: productStockData,
        productDetails: foundProductObject?.data ? foundProductObject.data : {},
      };
    })
  );
};

module.exports.getSingleProductStockWithDetails = async ({ productStock }) => {
  const foundProductObject = await CommonUtility.getProductDetailsByProductId({
    productId: productStock.productId,
  });
  return {
    stockDetails: productStock,
    productDetails: foundProductObject?.data ? foundProductObject.data : {},
  };
};

module.exports.getAllProductStocksData = async ({ req }) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  return await Stocks.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then(async (allProductStocks) => {
      if (allProductStocks && allProductStocks.length > 0) {
        const returnedData = await this.getAllProductStocksWithDetails({
          allProductStocks: CommonUtility.sortObjectsOfArray(allProductStocks),
        });

        return {
          status: "success",
          message: "Product stocks fetched successfully.",
          data: returnedData,
        };
      } else {
        return {
          status: "success",
          message:
            "Product stocks fetched successfully. But product stocks doesn't have any data.",
          data: [],
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: [],
      };
    });
};

module.exports.getProductStockDataByStockId = async ({ stockID }) => {
  return await Stocks.findOne({
    id: stockID,
  })
    .select(["-_id"])
    .then(async (productStock) => {
      if (productStock && Object.keys(productStock).length > 0) {
        const returnedData = await this.getSingleProductStockWithDetails({
          productStock: CommonUtility.sortObject(productStock),
        });
        return {
          status: "success",
          message: `Product stock with stockID ${stockID} fetched successfully.`,
          data: returnedData,
        };
      } else {
        return {
          status: "error",
          message: `There is no product stock exists with stockID ${stockID}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: {},
      };
    });
};

module.exports.getProductStockDataByProductIdUtil = async ({ productID }) => {
  return await Stocks.findOne({
    productId: productID,
  })
    .select(["-_id"])
    .then(async (productStock) => {
      if (productStock && Object.keys(productStock).length > 0) {
        const returnedData = await this.getSingleProductStockWithDetails({
          productStock: CommonUtility.sortObject(productStock),
        });
        return {
          status: "success",
          message: `Product stock with productID ${productID} fetched successfully.`,
          data: returnedData,
        };
      } else {
        return {
          status: "error",
          message: `There is no product stock exists with productID ${productID}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: {},
      };
    });
};

module.exports.getProductStockDataByBrandIdUtil = async ({ brandID }) => {
  return await Stocks.findOne({
    brandId: brandID,
  })
    .select(["-_id"])
    .then(async (productStock) => {
      if (productStock && Object.keys(productStock).length > 0) {
        const returnedData = await this.getSingleProductStockWithDetails({
          productStock: CommonUtility.sortObject(productStock),
        });
        return {
          status: "success",
          message: `Product stock with brandId ${brandID} fetched successfully.`,
          data: returnedData,
        };
      } else {
        return {
          status: "error",
          message: `There is no product stock exists with brandId ${brandID}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: {},
      };
    });
};

module.exports.addNewProductStockUtil = async ({ productStockSchema, res }) => {
  const stockDataByProductId = await this.getProductStockDataByProductIdUtil({
    productID: productStockSchema.productId,
  });

  if (
    stockDataByProductId.status === "success" &&
    stockDataByProductId?.data?.brandId === productStockSchema?.brandId
  ) {
    res.json({
      status: "error",
      message: `Product stock data is not added. Product stock already exists with productId ${stockDataByProductId.data.productId} and brandId ${stockDataByProductId.data.brandId}`,
      data: stockDataByProductId?.data ?? {},
    });
    return;
  }

  productStockSchema
    .save()
    .then(async (respondedProductStockObject) => {
      if (
        respondedProductStockObject &&
        Object.keys(respondedProductStockObject).length > 0
      ) {
        const returnedData = await this.getSingleProductStockWithDetails({
          productStock: respondedProductStockObject,
        });
        res.json({
          status: "success",
          message: `New product stock data is added successfully.`,
          data: returnedData,
        });
      } else {
        res.json({
          status: "error",
          message: `Product stock data is not added due to unknown error.`,
          data: {},
        });
      }
    })
    .catch((error) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${error.message}`,
        data: {},
      });
    });
};

module.exports.deleteProductStockUtil = async ({ stockID, res }) => {
  return await Stocks.deleteOne({
    id: stockID,
  })
    .select(["-_id"])
    .then(async (result) => {
      if (result && result.deletedCount === 1) {
        res.json({
          status: "success",
          message: `Product stock with stock id ${stockID} is deleted successfully.`,
          data: {},
        });
      } else {
        res.json({
          status: "error",
          message: `Product stock with stock id ${stockID} is not deleted.`,
          data: {},
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${err.message}`,
        data: {},
      });
    });
};

module.exports.updateProductStockUtil = async ({
  req,
  res,
  alreadyAddedTotalQuantities,
}) => {
  const stockId = req.params.stockID;
  const quantityRecieved = req.body.quantityRecieved;
  const quantityAvailable = req.body.quantityAvailable;
  const totalQuantities =
    alreadyAddedTotalQuantities + req.body.quantityRecieved;

  const newProductStock = {
    id: stockId,
    totalQuantities: totalQuantities,
    quantityRecieved: quantityRecieved,
    quantityAvailable: quantityAvailable,
    dateModified: new Date(),
  };

  const updatedProductStockSet = {
    $set: newProductStock,
  };

  Stocks.updateOne({ id: stockId }, updatedProductStockSet)
    .then((respondedProductStockObject) => {
      if (
        respondedProductStockObject &&
        Object.keys(respondedProductStockObject).length > 0
      ) {
        res.json({
          status: "success",
          message: `Product stock is updated successfully.`,
          data: newProductStock,
        });
      } else {
        res.json({
          status: "error",
          message: `Product stock is not updated due to unknown error.`,
          data: {},
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${err.message}`,
        data: {},
      });
    });
};
