const express = require("express");
const router = express.Router();
const stocks = require("../../controller/v3/stocks");

router.get("/allProductStocks", stocks.getAllProductStocks);
router.get("/productStockByStockId/:stockID", stocks.getProductStockByStockId);
router.post("/addProductStock", stocks.addProductStock);
router.delete("/deleteProductStock/:stockID", stocks.deleteProductStock);
router.put("/updateProductStock/:stockID", stocks.updateProductStock);
router.get(
  "/productStockByProductId/:productID",
  stocks.getProductStockDataByProductId
);
router.get(
  "/productStockByBrandId/:brandID",
  stocks.getProductStockDataByBrandId
);

module.exports = router;
