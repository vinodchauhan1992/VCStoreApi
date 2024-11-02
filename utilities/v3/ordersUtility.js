const OrdersSchema = require("../../model/v3/orders");
const CommonApisUtility = require("../../utilities/v3/commonApisUtility");
const CommonUtility = require("../../utilities/v3/commonUtility");
const OrdersValidationsUtility = require("../../utilities/v3/ordersValidationsUtility");
const CartsUtility = require("../../utilities/v3/cartsUtility");

module.exports.getAllOrdersUtil = async ({ req }) => {
  const foundOrdersObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: OrdersSchema,
    schemaName: "Orders",
    arrSortByKey: "orderNumber",
  });

  if (foundOrdersObj?.status === "error") {
    return foundOrdersObj;
  }

  const fullDetailsObj =
    await OrdersValidationsUtility.getAllOrdersWithFullDetails({
      allOrders: foundOrdersObj?.data ?? [],
    });

  return {
    ...foundOrdersObj,
    data: fullDetailsObj,
  };
};

module.exports.getOrderByOrderIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Order id is required.`,
      data: {},
    };
  }

  const orderID = req.body.id;
  const foundOrderObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: OrdersSchema,
    schemaName: "Order",
    dataID: orderID,
  });

  if (foundOrderObj?.status === "error") {
    return foundOrderObj;
  }

  const fullDetailsObj =
    await OrdersValidationsUtility.getSingleOrderWithFullDetails({
      orderData: foundOrderObj?.data,
    });

  return {
    ...foundOrderObj,
    data: fullDetailsObj,
  };
};

module.exports.getOrderByOrderCodeUtil = async ({ req }) => {
  if (!req?.body?.code || req.body.code === "") {
    return {
      status: "error",
      message: `Order code is required.`,
      data: {},
    };
  }

  const orderCode = req.body.code;
  const foundOrderObj = await CommonApisUtility.getDataByCodeFromSchemaUtil({
    schema: OrdersSchema,
    schemaName: "Order",
    dataCode: orderCode,
  });

  if (foundOrderObj?.status === "error") {
    return foundOrderObj;
  }

  const fullDetailsObj =
    await OrdersValidationsUtility.getSingleOrderWithFullDetails({
      orderData: foundOrderObj?.data,
    });

  return {
    ...foundOrderObj,
    data: fullDetailsObj,
  };
};

module.exports.getOrdersByCustomerIDUtil = async ({ req }) => {
  if (!req?.body?.customerID || req.body.customerID === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }

  const customerID = req.body.customerID;
  const foundOrdersObj = await CommonApisUtility.getDataArrayByIdFromSchemaUtil(
    {
      req: req,
      schema: OrdersSchema,
      schemaName: "Orders",
      dataID: customerID,
      keyname: "customerID",
    }
  );

  if (foundOrdersObj?.status === "error") {
    return foundOrdersObj;
  }

  const fullDetailsObj =
    await OrdersValidationsUtility.getAllOrdersWithFullDetails({
      allOrders: foundOrdersObj?.data ?? [],
    });

  return {
    ...foundOrdersObj,
    data: fullDetailsObj,
  };
};

module.exports.createNewOrderUtil = async ({ req }) => {
  const validationObj = await OrdersValidationsUtility.validationForNewOrder({
    req: req,
  });
  if (validationObj?.status === "error") {
    return validationObj;
  }

  const dataToAdd = validationObj.data.dataToAdd;
  const cartID = dataToAdd.cart.id;

  const newOrderSchema = new OrdersSchema(dataToAdd);

  const newlyCreatedOrder = await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newOrderSchema,
    schemaName: "Order",
  });

  if (newlyCreatedOrder?.status === "error") {
    return newlyCreatedOrder;
  }

  const newlyCreatedOrderData = newlyCreatedOrder.data;
  const newlyCreatedFullOrderDetailsObj =
    await OrdersValidationsUtility.getSingleOrderWithFullDetails({
      orderData: newlyCreatedOrderData,
    });

  await CartsUtility.deleteCartUtil({
    req: {
      body: {
        id: cartID,
      },
    },
  });

  return {
    ...newlyCreatedOrder,
    data: newlyCreatedFullOrderDetailsObj,
  };
};

module.exports.updateOrderDeliveryStatusUtil = async ({ req }) => {
  return {
    status: "error",
    message: `updateOrderDeliveryStatusUtil`,
    data: {},
  };
};

module.exports.updateOrderDeliveryDateUtil = async ({ req }) => {
  return {
    status: "error",
    message: `updateOrderDeliveryDateUtil`,
    data: {},
  };
};
