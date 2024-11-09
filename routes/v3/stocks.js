const express = require("express");
const router = express.Router();
const stocks = require("../../controller/v3/stocks");

router.post("/allProductStocks", stocks.getAllProductStocks);
router.post("/productStockByStockId", stocks.getProductStockByStockId);
router.post("/addNewProductStock", stocks.addNewProductStock);
router.post("/deleteProductStock", stocks.deleteProductStock);
router.post("/productStockByProductId", stocks.getProductStockByProductId);
router.post("/updateProductStock", stocks.updateProductStock);
router.post("/updateStockAfterItemSold", stocks.updateStockAfterItemSold);

module.exports = router;
