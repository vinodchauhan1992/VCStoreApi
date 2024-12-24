const OrdersSchema = require("../../model/v3/orders");
const DeliveryStatusesSchema = require("../../model/v3/deliveryStatuses");
const CommonApisUtility = require("../../utilities/v3/commonApisUtility");
const CommonUtility = require("../../utilities/v3/commonUtility");
const OrdersValidationsUtility = require("../../utilities/v3/ordersValidationsUtility");
const CartsUtility = require("../../utilities/v3/cartsUtility");
const StocksUtility = require("../../utilities/v3/stocksUtility");
const CompanyAccountsUtility = require("../../utilities/v3/companyAccountsUtility");
const ConstantsUtility = require("../../utilities/v3/constantsUtility");

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

module.exports.getOrdersByDeliveryStatusUtil = async ({ req }) => {
  if (!req?.body?.deliveryStatusID || req.body.deliveryStatusID === "") {
    return {
      status: "error",
      message: `Delivery status is required.`,
      data: {},
    };
  }

  const deliveryStatusID = req.body.deliveryStatusID;
  const foundOrdersObj = await CommonApisUtility.getDataArrayByIdFromSchemaUtil(
    {
      req: req,
      schema: OrdersSchema,
      schemaName: "Orders",
      dataID: deliveryStatusID,
      keyname: "deliveryStatusID",
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

  const productsArr = dataToAdd?.cart?.products ?? [];
  const stockDataArr = [];
  productsArr.map((productData) => {
    if (productData?.count && productData.count > 0) {
      stockDataArr.push({
        stockID: productData?.productDetails?.stockDetails?.id,
        soldQty: productData?.count,
      });
    }
  });

  await StocksUtility.updateStockAfterItemSoldUtil({
    req: {
      body: {
        dataArr: stockDataArr,
      },
    },
  });

  const foundAccObj =
    await CompanyAccountsUtility.getCompanyAccountByAccountNumberUtil({
      req: {
        body: {
          accountNumber: ConstantsUtility.utils.DEFAULT_ACCOUNT_NUMBER,
        },
      },
    });
  if (foundAccObj?.status === "success") {
    await CompanyAccountsUtility.addAccountBalanceViaOrderUtil({
      req: {
        body: {
          id: foundAccObj.data.id,
          accountBalance: dataToAdd?.cart?.payableAmount ?? 0,
          fromAccountName: dataToAdd?.paymentInfo?.cardName,
          fromBankName: dataToAdd?.paymentInfo?.bankName,
          fromAccountNumber: dataToAdd?.paymentInfo?.cardNumber,
          cardType: dataToAdd?.paymentInfo?.cardType,
          expiryMonth: dataToAdd?.paymentInfo?.cardExpiryMonth,
          expiryYear: dataToAdd?.paymentInfo?.cardExpiryYear,
          cvv: dataToAdd?.paymentInfo?.cardCVV,
          transactionDescription: `Transaction for order:-\n1. Order code "${newlyCreatedFullOrderDetailsObj?.code}"\n2. Ordered by "${newlyCreatedFullOrderDetailsObj?.customerDetails?.name?.firstname} ${newlyCreatedFullOrderDetailsObj?.customerDetails?.name?.lastname}"\n3. Customer code "${newlyCreatedFullOrderDetailsObj?.customerDetails?.customerCode}"`,
        },
      },
    });
  }

  return {
    ...newlyCreatedOrder,
    message: `Your order is placed successfully.`,
    data: newlyCreatedFullOrderDetailsObj,
  };
};

module.exports.updateOrderDeliveryStatusUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Order id is required.`,
      data: {},
    };
  }
  if (!req?.body?.deliveryStatusID || req.body.deliveryStatusID === "") {
    return {
      status: "error",
      message: `Delivery status id is required.`,
      data: {},
    };
  }

  const orderID = req.body.id;
  const deliveryStatusID = req.body.deliveryStatusID;

  const foundOrderByOrderID = await this.getOrderByOrderIDUtil({ req: req });
  if (foundOrderByOrderID?.status === "error") {
    return foundOrderByOrderID;
  }

  const foundDeliveryStatusByDeliveryStatusID =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: DeliveryStatusesSchema,
      schemaName: "Delivery Status",
      dataID: deliveryStatusID,
    });
  if (foundDeliveryStatusByDeliveryStatusID?.status === "error") {
    return foundDeliveryStatusByDeliveryStatusID;
  }

  const newOrderSchema = {
    id: orderID,
    deliveryStatusID: deliveryStatusID,
    dateModified: new Date(),
  };

  const updatedOrderSet = {
    $set: newOrderSchema,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: OrdersSchema,
    newDataObject: newOrderSchema,
    updatedDataSet: updatedOrderSet,
    schemaName: "Order",
    dataID: orderID,
  });
};

module.exports.updateOrderDeliveryDateUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Order id is required.`,
      data: {},
    };
  }
  if (!req?.body?.deliveryDate || req.body.deliveryDate === "") {
    return {
      status: "error",
      message: `Delivery date is required.`,
      data: {},
    };
  }
  const deliveryDate = req.body.deliveryDate;
  if (!CommonUtility.isValidDate({ date: deliveryDate })) {
    return {
      status: "error",
      message: `Delivery date is invalid.`,
      data: {},
    };
  }

  const orderID = req.body.id;

  const foundOrderByOrderID = await this.getOrderByOrderIDUtil({ req: req });
  if (foundOrderByOrderID?.status === "error") {
    return foundOrderByOrderID;
  }

  const newOrderSchema = {
    id: orderID,
    deliveryDate: deliveryDate,
    dateModified: new Date(),
  };

  const updatedOrderSet = {
    $set: newOrderSchema,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: OrdersSchema,
    newDataObject: newOrderSchema,
    updatedDataSet: updatedOrderSet,
    schemaName: "Order",
    dataID: orderID,
  });
};

module.exports.updateOrderInvoiceIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Order id is required.`,
      data: {},
    };
  }
  const updateType = req.body.updateType;
  if (updateType === "generate") {
    if (!req?.body?.invoiceID || req.body.invoiceID === "") {
      return {
        status: "error",
        message: `Invoice id is required.`,
        data: {},
      };
    }
  }

  const orderID = req.body.id;
  const invoiceID = req.body.invoiceID;
  if (updateType === "generate") {
    const foundOrderByOrderID = await this.getOrderByOrderIDUtil({ req: req });
    if (foundOrderByOrderID?.status === "error") {
      return foundOrderByOrderID;
    }
  }

  const newOrderSchema = {
    id: orderID,
    invoiceID: invoiceID ? invoiceID : null,
    dateModified: new Date(),
  };

  const updatedOrderSet = {
    $set: newOrderSchema,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: OrdersSchema,
    newDataObject: newOrderSchema,
    updatedDataSet: updatedOrderSet,
    schemaName: "Order",
    dataID: orderID,
  });
};

module.exports.deleteOrderByIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Order id is required.`,
      data: {},
    };
  }

  const orderID = req.body.id;

  const foundOrderObj = await this.getOrderByOrderIDUtil({
    req: {
      body: {
        id: orderID,
      },
    },
  });

  if (foundOrderObj?.status === "error") {
    return foundOrderObj;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: OrdersSchema,
    schemaName: "Order",
    dataID: orderID,
  });
};

module.exports.deleteAllOrdersUtil = async ({ req }) => {
  return await CommonApisUtility.deleteAllDataFromSchemaUtil({
    schema: OrdersSchema,
    schemaName: "Order",
  });
};
