const OrdersUtility = require("../../utilities/v3/ordersUtility");

module.exports.getAllOrders = async (req, res) => {
  const foundItemObj = await OrdersUtility.getAllOrdersUtil({ req });
  res.json(foundItemObj);
};

module.exports.getOrderByOrderID = async (req, res) => {
  const foundItemObj = await OrdersUtility.getOrderByOrderIDUtil({ req });
  res.json(foundItemObj);
};

module.exports.getOrderByOrderCode = async (req, res) => {
  const foundItemObj = await OrdersUtility.getOrderByOrderCodeUtil({ req });
  res.json(foundItemObj);
};

module.exports.getOrdersByCustomerID = async (req, res) => {
  const foundItemObj = await OrdersUtility.getOrdersByCustomerIDUtil({ req });
  res.json(foundItemObj);
};

module.exports.getOrdersByDeliveryStatus = async (req, res) => {
  const foundItemObj = await OrdersUtility.getOrdersByDeliveryStatusUtil({
    req,
  });
  res.json(foundItemObj);
};

module.exports.createNewOrder = async (req, res) => {
  const foundItemObj = await OrdersUtility.createNewOrderUtil({ req });
  res.json(foundItemObj);
};

module.exports.updateOrderDeliveryStatus = async (req, res) => {
  const foundItemObj = await OrdersUtility.updateOrderDeliveryStatusUtil({
    req,
  });
  res.json(foundItemObj);
};

module.exports.updateOrderDeliveryDate = async (req, res) => {
  const foundItemObj = await OrdersUtility.updateOrderDeliveryDateUtil({
    req,
  });
  res.json(foundItemObj);
};

module.exports.updateOrderInvoiceID = async (req, res) => {
  const foundItemObj = await OrdersUtility.updateOrderInvoiceIDUtil({
    req,
  });
  res.json(foundItemObj);
};
