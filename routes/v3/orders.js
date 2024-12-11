const express = require("express");
const router = express.Router();
const orders = require("../../controller/v3/orders");

router.post("/allOrders", orders.getAllOrders);
router.post("/orderByOrderID", orders.getOrderByOrderID);
router.post("/orderByOrderCode", orders.getOrderByOrderCode);
router.post("/ordersByCustomerID", orders.getOrdersByCustomerID);
router.post("/ordersByDeliveryStatus", orders.getOrdersByDeliveryStatus);
router.post("/createNewOrder", orders.createNewOrder);
router.post("/updateOrderDeliveryStatus", orders.updateOrderDeliveryStatus);
router.post("/updateOrderDeliveryDate", orders.updateOrderDeliveryDate);
router.post("/updateOrderInvoiceID", orders.updateOrderInvoiceID);
router.post("/deleteOrderByID", orders.deleteOrderByID);
router.post("/deleteAllOrders", orders.deleteAllOrders);

module.exports = router;
