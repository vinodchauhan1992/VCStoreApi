const InvoicesSchema = require("../../model/v3/invoices");
const CommonApisUtility = require("../../utilities/v3/commonApisUtility");
const CommonUtility = require("../../utilities/v3/commonUtility");
const ConstantsUtility = require("../../utilities/v3/constantsUtility");
const OrdersUtility = require("../../utilities/v3/ordersUtility");

module.exports.getSingleInvoiceWithAllDetailsUtil = async ({ invoiceData }) => {
  const customerByIdObject = await CommonUtility.getCustomerByIDForCommonUtil({
    customerID: invoiceData?.customerID,
  });

  return {
    id: invoiceData?.id ?? "",
    invoiceNumber: invoiceData?.invoiceNumber ?? "",
    code: invoiceData?.code ?? "",
    customerDetails: customerByIdObject.data,
    orderDetails: invoiceData?.orderDetails ?? {},
    fromAddress: invoiceData?.fromAddress ?? {},
    subTotal: invoiceData?.subTotal ?? 0,
    discount: invoiceData?.discount ?? 0,
    couponDiscount: invoiceData?.couponDiscount ?? 0,
    taxAmount: invoiceData?.taxAmount ?? 0,
    taxPercent: invoiceData?.taxPercent ?? 0,
    total: invoiceData?.total ?? 0,
    dateAdded: invoiceData?.dateAdded ?? new Date(),
  };
};

module.exports.getAllInvoicesArrWithAllDetailsUtil = async ({
  allInvoicesArr,
}) => {
  return Promise.all(
    allInvoicesArr?.map(async (invoiceData) => {
      const invoiceDetailsData = await this.getSingleInvoiceWithAllDetailsUtil({
        invoiceData: invoiceData,
      });
      return invoiceDetailsData;
    })
  );
};

module.exports.getAllInvoicesUtil = async ({ req }) => {
  const foundInvoicesDataObj = await CommonApisUtility.getAllDataFromSchemaUtil(
    {
      req: req,
      schema: InvoicesSchema,
      schemaName: "Invoices",
      arrSortByKey: "invoiceNumber",
    }
  );

  if (foundInvoicesDataObj?.status === "error") {
    return foundInvoicesDataObj;
  }

  const fullDetailsArrObj = await this.getAllInvoicesArrWithAllDetailsUtil({
    allInvoicesArr: foundInvoicesDataObj?.data ?? [],
  });

  return {
    ...foundInvoicesDataObj,
    data: fullDetailsArrObj,
  };
};

module.exports.getInvoiceByInvoiceIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Invoice id is required.`,
      data: {},
    };
  }

  const invoiceID = req.body.id;

  const foundInvoiceDataObj = await CommonApisUtility.getDataByIdFromSchemaUtil(
    {
      schema: InvoicesSchema,
      schemaName: "Invoice",
      dataID: invoiceID,
    }
  );
  if (foundInvoiceDataObj?.status === "error") {
    return foundInvoiceDataObj;
  }

  const fullDetailsObj = await this.getSingleInvoiceWithAllDetailsUtil({
    invoiceData: foundInvoiceDataObj.data,
  });

  return {
    ...foundInvoiceDataObj,
    data: fullDetailsObj,
  };
};

module.exports.getInvoiceByInvoiceCodeUtil = async ({ req }) => {
  if (!req?.body?.code || req.body.code === "") {
    return {
      status: "error",
      message: `Invoice code is required.`,
      data: {},
    };
  }

  const invoiceCode = req.body.code;

  const foundInvoiceDataObj =
    await CommonApisUtility.getDataByCodeFromSchemaUtil({
      schema: InvoicesSchema,
      schemaName: "Invoice",
      dataCode: invoiceCode,
    });
  if (foundInvoiceDataObj?.status === "error") {
    return foundInvoiceDataObj;
  }

  const fullDetailsObj = await this.getSingleInvoiceWithAllDetailsUtil({
    invoiceData: foundInvoiceDataObj.data,
  });

  return {
    ...foundInvoiceDataObj,
    data: fullDetailsObj,
  };
};

module.exports.getInvoiceByOrderIDUtil = async ({ req }) => {
  if (!req?.body?.orderID || req.body.orderID === "") {
    return {
      status: "error",
      message: `Order id is required.`,
      data: {},
    };
  }

  const orderID = req.body.orderID;

  const foundInvoiceDataObj = await CommonApisUtility.getDataByIdFromSchemaUtil(
    {
      schema: InvoicesSchema,
      schemaName: "Invoice",
      dataID: orderID,
      keyname: "orderDetails.id",
    }
  );
  if (foundInvoiceDataObj?.status === "error") {
    return {
      ...foundInvoiceDataObj,
      message: `There is no invoice exists for order id ${orderID}.`,
    };
  }

  const fullDetailsObj = await this.getSingleInvoiceWithAllDetailsUtil({
    invoiceData: foundInvoiceDataObj.data,
  });

  return {
    ...foundInvoiceDataObj,
    data: fullDetailsObj,
  };
};

module.exports.getInvoicesByCustomerIDUtil = async ({ req }) => {
  if (!req?.body?.customerID || req.body.customerID === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }

  const customerID = req.body.customerID;

  const foundInvoiceDataObj =
    await CommonApisUtility.getDataArrayByIdFromSchemaUtil({
      schema: InvoicesSchema,
      schemaName: "Invoice",
      dataID: customerID,
      keyname: "customerID",
    });
  if (foundInvoiceDataObj?.status === "error") {
    return {
      ...foundInvoiceDataObj,
      message: `There are no invoices exists for customer id ${customerID}.`,
    };
  }

  const fullDetailsObj = await this.getAllInvoicesArrWithAllDetailsUtil({
    allInvoicesArr: foundInvoiceDataObj?.data ?? [],
  });

  return {
    ...foundInvoiceDataObj,
    data: fullDetailsObj,
  };
};

module.exports.getNewInvoiceNumberUtil = async ({ req }) => {
  const allItemsObj = await this.getAllInvoicesUtil({
    req,
  });
  const dataArr = allItemsObj?.data ?? [];

  let currentMaxItemNumber = Number(
    `2024${new Date().getFullYear()}${
      new Date().getMonth() + 1
    }${new Date().getDate()}`
  );

  if (dataArr && dataArr.length > 0) {
    const itemNumbersArr = [];
    dataArr.map((item) => {
      itemNumbersArr.push(item.invoiceNumber);
    });
    const maxItemNumber = itemNumbersArr.reduce(function (prev, current) {
      return prev && prev > current ? prev : current;
    });
    if (maxItemNumber) {
      currentMaxItemNumber = maxItemNumber ?? 0;
    }
  }
  const newItemNumber = currentMaxItemNumber + 1;
  return newItemNumber;
};

module.exports.generateNewInvoiceUtil = async ({ req }) => {
  if (!req?.body?.orderID || req.body.orderID === "") {
    return {
      status: "error",
      message: `Order id is required.`,
      data: {},
    };
  }

  const orderID = req.body.orderID;

  const foundInvoiceByOrderIDObj = await this.getInvoiceByOrderIDUtil({
    req: {
      body: {
        orderID: orderID,
      },
    },
  });
  if (foundInvoiceByOrderIDObj?.status === "success") {
    return {
      status: "error",
      message: `Invoice is already generated for this order with order id ${orderID}.`,
      data: {},
    };
  }

  const foundOrderObj = await OrdersUtility.getOrderByOrderIDUtil({
    req: {
      body: {
        id: orderID,
      },
    },
  });
  if (foundOrderObj?.status === "error") {
    return {
      ...foundOrderObj,
      message: `There is no order exists for order id ${orderID}.`,
      data: {},
    };
  }

  const orderData = foundOrderObj?.data ?? null;
  if (!orderData) {
    return {
      status: "error",
      message: `There is no order found for order id ${orderID}.`,
      data: {},
    };
  }

  const newInvoiceNumber = await this.getNewInvoiceNumberUtil({
    req,
  });
  const paddedNewInvoiceNumber = String(newInvoiceNumber).padStart(14, "0");
  const code = `INV${paddedNewInvoiceNumber}`;
  const invoiceID = CommonUtility.getUniqueID();
  const { COMPANY_HQ_ADDR, PRODUCTS_TAX_PERCENT } = ConstantsUtility.utils;
  const cartData = orderData.cart;
  const discount = CommonUtility.amountRoundingFunc({
    value: cartData.discount,
  });
  const couponDiscount = CommonUtility.amountRoundingFunc({
    value: cartData.couponDiscount,
  });
  const totalAmount = CommonUtility.amountRoundingFunc({
    value: cartData.payableAmount,
  });
  const taxPercent = PRODUCTS_TAX_PERCENT;
  const taxAmount = CommonUtility.amountRoundingFunc({
    value: (totalAmount / 100) * taxPercent,
  });
  const subTotalAmount = CommonUtility.amountRoundingFunc({
    value: totalAmount - taxAmount,
  });

  const newInvoiceSchema = new InvoicesSchema({
    id: invoiceID,
    invoiceNumber: newInvoiceNumber,
    code: code,
    customerID: orderData.customerDetails.id,
    orderDetails: orderData,
    fromAddress: {
      name: COMPANY_HQ_ADDR.NAME,
      address1: COMPANY_HQ_ADDR.ADDRESS_1,
      address2: COMPANY_HQ_ADDR.ADDRESS_2,
      country: COMPANY_HQ_ADDR.COUNTRY,
      state: COMPANY_HQ_ADDR.STATE,
      city: COMPANY_HQ_ADDR.CITY,
      pincode: COMPANY_HQ_ADDR.PINCODE,
      phone: COMPANY_HQ_ADDR.PHONE,
    },
    subTotal: subTotalAmount,
    discount: discount,
    couponDiscount: couponDiscount,
    taxAmount: taxAmount,
    taxPercent: taxPercent,
    total: totalAmount,
    dateAdded: new Date(),
  });

  const newlyGeneratedInvoiceObj =
    await CommonApisUtility.addNewDataToSchemaUtil({
      newSchema: newInvoiceSchema,
      schemaName: "Invoice",
    });

  if (newlyGeneratedInvoiceObj?.status === "error") {
    return newlyGeneratedInvoiceObj;
  }

  const fullDetailsDataObj = await this.getSingleInvoiceWithAllDetailsUtil({
    invoiceData: newlyGeneratedInvoiceObj.data,
  });

  await OrdersUtility.updateOrderInvoiceIDUtil({
    req: {
      body: {
        id: orderID,
        invoiceID: invoiceID,
        updateType: "generate",
      },
    },
  });

  return {
    ...newlyGeneratedInvoiceObj,
    data: fullDetailsDataObj,
  };
};

module.exports.deleteInvoiceUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Invoice id is required.`,
      data: {},
    };
  }

  const invoiceID = req.body.id;
  const foundInvoiceByInvoiceIDObj = await this.getInvoiceByInvoiceIDUtil({
    req: req,
  });
  if (foundInvoiceByInvoiceIDObj?.status === "error") {
    return foundInvoiceByInvoiceIDObj;
  }

  const orderID = foundInvoiceByInvoiceIDObj?.data?.orderDetails?.id;
  const deleteInvObj = await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: InvoicesSchema,
    schemaName: "Invoice",
    dataID: invoiceID,
  });

  await OrdersUtility.updateOrderInvoiceIDUtil({
    req: {
      body: {
        id: orderID,
        invoiceID: null,
        updateType: "delete",
      },
    },
  });

  return deleteInvObj;
};
