const StocksUtility = require("../../utilities/v3/stocksUtility");

module.exports.getAllProductStocks = async (req, res) => {
  const foundProductStockObj = await StocksUtility.getAllProductStocksUtil({
    req: req,
  });
  res.json(foundProductStockObj);
};

module.exports.getProductStockByStockId = async (req, res) => {
  const foundProductStockObj = await StocksUtility.getProductStockByStockIdUtil(
    { req: req }
  );
  res.json(foundProductStockObj);
};

module.exports.getProductStockByProductId = async (req, res) => {
  const foundProductStockObj =
    await StocksUtility.getProductStockByProductIdUtil({ req: req });
  res.json(foundProductStockObj);
};

module.exports.addNewProductStock = async (req, res) => {
  const foundProductStockObj = await StocksUtility.addNewProductStockUtil({
    req: req,
  });
  res.json(foundProductStockObj);
};

module.exports.deleteProductStock = async (req, res) => {
  const foundProductStockObj = await StocksUtility.deleteProductStockUtil({
    req: req,
  });
  res.json(foundProductStockObj);
};

module.exports.updateProductStock = async (req, res) => {
  const foundProductStockObj = await StocksUtility.updateProductStockUtil({
    req: req,
  });
  res.json(foundProductStockObj);
};
