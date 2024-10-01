const express = require("express");
const router = express.Router();
const stocks = require("../../controller/v3/stocks");

router.post("/allProductStocks", stocks.getAllProductStocks);
router.post("/productStockByStockId", stocks.getProductStockByStockId);
router.post("/addProductStock", stocks.addProductStock);
router.post("/deleteProductStock", stocks.deleteProductStock);
router.post("/updateProductStock", stocks.updateProductStock);
router.post("/productStockByProductId", stocks.getProductStockDataByProductId);
router.post("/productStockByBrandId", stocks.getProductStockDataByBrandId);

module.exports = router;
