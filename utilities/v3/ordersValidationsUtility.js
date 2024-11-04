const OrdersSchema = require("../../model/v3/orders");
const CartsSchema = require("../../model/v3/carts");
const CustomersSchema = require("../../model/v3/customers");
const CommonApisUtility = require("../../utilities/v3/commonApisUtility");
const CommonUtility = require("../../utilities/v3/commonUtility");
const CustomersUtility = require("../../utilities/v3/customersUtility");
const CartsUtility = require("../../utilities/v3/cartsUtility");
const DeliveryStatusesUtility = require("../../utilities/v3/deliveryStatusesUtility");

module.exports.getSingleProductDetailsUtil = async ({ productData }) => {
  const productByIdObject = await CommonUtility.getProductByIDForCommonUtil({
    productID: productData?.productID,
  });

  return {
    productDetails: productByIdObject.data,
    count: productData?.count ?? 1,
  };
};

module.exports.getAllProductsArrForACustomerOrderUtil = async ({
  productsArr,
}) => {
  return Promise.all(
    productsArr?.map(async (productData) => {
      const productDetailsData = await this.getSingleProductDetailsUtil({
        productData: productData,
      });
      return productDetailsData;
    })
  );
};

module.exports.getFullCustomerDetailsObj = async ({ customerID }) => {
  const fullItemDetailsObj = await CustomersUtility.getCustomerByIDUtil({
    req: {
      body: {
        id: customerID,
      },
    },
  });
  let fullCustomerDetailsData = { id: customerID };
  if (
    fullItemDetailsObj?.status !== "error" &&
    fullItemDetailsObj?.data &&
    Object.keys(fullItemDetailsObj.data).length > 0
  ) {
    fullCustomerDetailsData = fullItemDetailsObj.data;
  }
  return { fullCustomerDetailsData: fullCustomerDetailsData };
};

module.exports.getFullDeliveryStatusDetailsObj = async ({
  deliveryStatusID,
}) => {
  const fullItemDetailsObj =
    await DeliveryStatusesUtility.getDeliveryStatusByIDUtil({
      req: {
        body: {
          id: deliveryStatusID,
        },
      },
    });
  let fullDeliveryDetailsData = { id: deliveryStatusID };
  if (
    fullItemDetailsObj?.status !== "error" &&
    fullItemDetailsObj?.data &&
    Object.keys(fullItemDetailsObj.data).length > 0
  ) {
    fullDeliveryDetailsData = fullItemDetailsObj.data;
  }
  return { fullDeliveryDetailsData: fullDeliveryDetailsData };
};

module.exports.getSingleOrderWithFullDetails = async ({ orderData }) => {
  const { fullCustomerDetailsData } = await this.getFullCustomerDetailsObj({
    customerID: orderData.customerID,
  });
  const { fullDeliveryDetailsData } =
    await this.getFullDeliveryStatusDetailsObj({
      deliveryStatusID: orderData.deliveryStatusID,
    });
  // const productsWithFullDetails =
  //   await this.getAllProductsArrForACustomerOrderUtil({
  //     productsArr: orderData?.cart?.products ?? [],
  //   });
  // const cartCustomerByIdObject =
  //   await CommonUtility.getCustomerByIDForCommonUtil({
  //     customerID: orderData?.cart?.customerID,
  //   });
  const newData = {
    id: orderData.id,
    orderNumber: orderData.orderNumber,
    code: orderData.code,
    customerDetails: fullCustomerDetailsData,
    cart: orderData.cart,
    contactInfo: orderData.contactInfo,
    shippingInfo: orderData.shippingInfo,
    billingInfo: orderData.billingInfo,
    paymentInfo: orderData.paymentInfo,
    deliveryStatusDetails: fullDeliveryDetailsData,
    invoiceID: orderData?.invoiceID ?? null,
    deliveryDate: orderData?.deliveryDate ?? null,
    dateAdded: orderData?.dateAdded,
    dateModified: orderData?.dateModified,
  };
  return newData;
};

module.exports.getAllOrdersWithFullDetails = async ({ allOrders }) => {
  return Promise.all(
    allOrders?.map(async (orderData) => {
      const orderDetails = await this.getSingleOrderWithFullDetails({
        orderData: orderData,
      });
      return orderDetails;
    })
  );
};

module.exports.shippingInfoValidation = async ({ req }) => {
  if (!req?.body?.shippingName || req.body.shippingName === "") {
    return {
      status: "error",
      message: `Shipping name is required.`,
      data: {},
    };
  }
  if (!CommonUtility.isValidOnlyCharacters({ text: req.body.shippingName })) {
    return {
      status: "error",
      message: `Shipping name can only contains characters and spaces. Any number or special characters are not allowed.`,
      data: {},
    };
  }
  if (!req?.body?.shippingAddress1 || req.body.shippingAddress1 === "") {
    return {
      status: "error",
      message: `Shipping address is required.`,
      data: {},
    };
  }
  if (!req?.body?.shippingCountry || req.body.shippingCountry === "") {
    return {
      status: "error",
      message: `Shipping country is required.`,
      data: {},
    };
  }
  if (!req?.body?.shippingState || req.body.shippingState === "") {
    return {
      status: "error",
      message: `Shipping state is required.`,
      data: {},
    };
  }
  if (!req?.body?.shippingCity || req.body.shippingCity === "") {
    return {
      status: "error",
      message: `Shipping city is required.`,
      data: {},
    };
  }
  if (!req?.body?.shippingPincode || req.body.shippingPincode === "") {
    return {
      status: "error",
      message: `Shipping pincode is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.shippingPincode)) {
    return {
      status: "error",
      message: `Shipping pincode must be number.`,
      data: {},
    };
  }
  if (req.body.shippingPincode.length < 6) {
    return {
      status: "error",
      message: `Shipping pincode must be 6 digits long.`,
      data: {},
    };
  }
  return {
    status: "success",
    message: `Shipping info is valid.`,
    data: {},
  };
};

module.exports.billingInfoValidation = async ({ req }) => {
  if (!req?.body?.billingName || req.body.billingName === "") {
    return {
      status: "error",
      message: `Billing name is required.`,
      data: {},
    };
  }
  if (!CommonUtility.isValidOnlyCharacters({ text: req.body.billingName })) {
    return {
      status: "error",
      message: `Billing name can only contains characters and spaces. Any number or special characters are not allowed.`,
      data: {},
    };
  }
  if (!req?.body?.billingAddress1 || req.body.billingAddress1 === "") {
    return {
      status: "error",
      message: `Billing address is required.`,
      data: {},
    };
  }
  if (!req?.body?.billingCountry || req.body.billingCountry === "") {
    return {
      status: "error",
      message: `Billing country is required.`,
      data: {},
    };
  }
  if (!req?.body?.billingState || req.body.billingState === "") {
    return {
      status: "error",
      message: `Billing state is required.`,
      data: {},
    };
  }
  if (!req?.body?.billingCity || req.body.billingCity === "") {
    return {
      status: "error",
      message: `Billing city is required.`,
      data: {},
    };
  }
  if (!req?.body?.billingPincode || req.body.billingPincode === "") {
    return {
      status: "error",
      message: `Billing pincode is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.billingPincode)) {
    return {
      status: "error",
      message: `Billing pincode must be number.`,
      data: {},
    };
  }
  if (req.body.billingPincode.length < 6) {
    return {
      status: "error",
      message: `Billing pincode must be 6 digits long.`,
      data: {},
    };
  }
  return {
    status: "success",
    message: `Billing info is valid.`,
    data: {},
  };
};

module.exports.cardExpiryInfoValidation = async ({ req }) => {
  if (!req?.body?.cardExpiryMonth || req.body.cardExpiryMonth === "") {
    return {
      status: "error",
      message: `Card expiry month is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.cardExpiryMonth)) {
    return {
      status: "error",
      message: `Card expiry month must be number.`,
      data: {},
    };
  }
  if (
    req.body.cardExpiryMonth.length < 2 ||
    req.body.cardExpiryMonth.length > 2
  ) {
    return {
      status: "error",
      message: `Card number must 2 digits long.`,
      data: {},
    };
  }
  if (!req?.body?.cardExpiryYear || req.body.cardExpiryYear === "") {
    return {
      status: "error",
      message: `Card expiry year is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.cardExpiryYear)) {
    return {
      status: "error",
      message: `Card expiry year must be number.`,
      data: {},
    };
  }
  if (
    req.body.cardExpiryYear.length < 4 ||
    req.body.cardExpiryYear.length > 4
  ) {
    return {
      status: "error",
      message: `Card expiry year must be 4 digits long.`,
      data: {},
    };
  }

  const currentDate = new Date();
  const todaysMonth = currentDate.getMonth() + 1; // Add 1 as months are zero-based
  const todaysYear = currentDate.getFullYear();
  const cardExpiryMonth = req.body.cardExpiryMonth;
  const cardExpiryYear = req.body.cardExpiryYear;
  if (
    (Number(cardExpiryMonth) < Number(todaysMonth) &&
      Number(cardExpiryYear) < Number(todaysYear)) ||
    (Number(cardExpiryMonth) < Number(todaysMonth) &&
      Number(cardExpiryYear) === Number(todaysYear)) ||
    (Number(cardExpiryMonth) === Number(todaysMonth) &&
      Number(cardExpiryYear) < Number(todaysYear))
  ) {
    return {
      status: "error",
      message: `Your payment card is expired.`,
      data: {},
    };
  }

  return {
    status: "success",
    message: `Card expiry info is valid.`,
    data: {},
  };
};

module.exports.cardInfoValidation = async ({ req }) => {
  if (!req?.body?.cardName || req.body.cardName === "") {
    return {
      status: "error",
      message: `Card name is required.`,
      data: {},
    };
  }
  if (!CommonUtility.isValidOnlyCharacters({ text: req.body.cardName })) {
    return {
      status: "error",
      message: `Card name can only contains characters and spaces. Any number or special characters are not allowed.`,
      data: {},
    };
  }
  if (!req?.body?.cardType || req.body.cardType === "") {
    return {
      status: "error",
      message: `Card type is required.`,
      data: {},
    };
  }
  if (!req?.body?.cardNumber || req.body.cardNumber === "") {
    return {
      status: "error",
      message: `Card number is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.cardNumber)) {
    return {
      status: "error",
      message: `Card number must be number.`,
      data: {},
    };
  }
  if (req.body.cardNumber.length < 16 || req.body.cardNumber.length > 16) {
    return {
      status: "error",
      message: `Card number must 16 digits long.`,
      data: {},
    };
  }

  const cardExpiryInfoValidationObj = await this.cardExpiryInfoValidation({
    req: req,
  });
  if (cardExpiryInfoValidationObj?.status === "error") {
    return cardExpiryInfoValidationObj;
  }

  if (!req?.body?.cardCVV || req.body.cardCVV === "") {
    return {
      status: "error",
      message: `Card cvv is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.cardCVV)) {
    return {
      status: "error",
      message: `Card cvv must be number.`,
      data: {},
    };
  }
  if (req.body.cardCVV.length < 3 || req.body.cardCVV.length > 3) {
    return {
      status: "error",
      message: `Card cvv must be 3 digits long.`,
      data: {},
    };
  }
  return {
    status: "success",
    message: `Card info is valid.`,
    data: {},
  };
};

module.exports.customerExistenceValidation = async ({ req }) => {
  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CustomersSchema,
    schemaName: "Customer",
    dataID: req.body.customerID,
  });
};

module.exports.cartExistenceByCustIDValidation = async ({ req }) => {
  const customerID = req.body.customerID;
  const foundCartObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CartsSchema,
    schemaName: "Cart",
    dataID: customerID,
    keyname: "customerID",
  });
  if (foundCartObj?.status === "error") {
    return {
      status: "error",
      message: `Order can't be created. There is no cart exists for customer id ${customerID}`,
      data: {},
    };
  }
  if (!foundCartObj?.data || Object.keys(foundCartObj.data).length <= 0) {
    return {
      status: "error",
      message: `Order can't be created. There are no items in the cart to order for customer id ${customerID}`,
      data: {},
    };
  }
  return {
    status: "success",
    message: `Order can be created.`,
    data: foundCartObj.data,
  };
};

module.exports.getNewOrderNumberUtil = async ({ req }) => {
  const allItemsObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: OrdersSchema,
    schemaName: "Orders",
    arrSortByKey: "orderNumber",
  });
  const dataArr = allItemsObj?.data ?? [];

  let currentMaxItemNumber = 14042024;

  if (dataArr && dataArr.length > 0) {
    const itemNumbersArr = [];
    dataArr.map((item) => {
      itemNumbersArr.push(item.orderNumber);
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

module.exports.createNewOrderDataToBeAdded = async ({ req, cartData }) => {
  const newOrderNumber = await this.getNewOrderNumberUtil({
    req,
  });
  const paddedNewOrderNumber = String(newOrderNumber).padStart(2, "0");
  const code = `OD${paddedNewOrderNumber}`;

  const dataToAdd = {
    id: CommonUtility.getUniqueID(),
    orderNumber: newOrderNumber,
    code: code,
    customerID: req.body.customerID,
    cart: cartData,
    contactInfo: {
      email: req.body.email,
      phone: req.body.phone,
    },
    shippingInfo: {
      name: req.body.shippingName,
      address1: req.body.shippingAddress1,
      address2: req?.body?.shippingAddress2 ? req.body.shippingAddress2 : "",
      country: req.body.shippingCountry,
      state: req.body.shippingState,
      city: req.body.shippingCity,
      pincode: req.body.shippingPincode,
    },
    billingInfo: {
      name: req.body.billingName,
      address1: req.body.billingAddress1,
      address2: req?.body?.billingAddress2 ? req.body.billingAddress2 : "",
      country: req.body.billingCountry,
      state: req.body.billingState,
      city: req.body.billingCity,
      pincode: req.body.billingPincode,
    },
    paymentInfo: {
      cardName: req.body.cardName,
      cardType: req.body.cardType,
      cardNumber: req.body.cardNumber,
      cardExpiryMonth: req.body.cardExpiryMonth,
      cardExpiryYear: req.body.cardExpiryYear,
      cardCVV: req.body.cardCVV,
    },
    deliveryStatusID: "d428d6ca-bc29-4828-beb4-ac320ef706e5",
    invoiceID: null,
    deliveryDate: null,
    dateAdded: new Date(),
    dateModified: new Date(),
  };

  return dataToAdd;
};

module.exports.emailInfoValidation = async ({ req }) => {
  if (!req?.body?.email || req.body.email === "") {
    return {
      status: "error",
      message: `Email is required.`,
      data: {},
    };
  }
  if (!CommonUtility.isValidEmail({ email: req.body.email })) {
    return {
      status: "error",
      message: "Email address is invalid.",
      data: {},
    };
  }
  return {
    status: "success",
    message: `Email info is valid.`,
    data: {},
  };
};

module.exports.phoneInfoValidation = async ({ req }) => {
  if (!req?.body?.phone || req.body.phone === "") {
    return {
      status: "error",
      message: `Phone is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.phone)) {
    return {
      status: "error",
      message: "Phone number is invalid.",
      data: {},
    };
  }
  if (req.body.phone.length < 10) {
    return {
      status: "error",
      message: "Phone number must be 10 digits long.",
      data: {},
    };
  }
  return {
    status: "success",
    message: `Email info is valid.`,
    data: {},
  };
};

module.exports.orderAmountValidation = async ({ cartData }) => {
  if (!cartData.totalAmount || cartData.totalAmount === "") {
    return {
      status: "error",
      message: `Total amount is required.`,
      data: {},
    };
  }
  if (isNaN(cartData.totalAmount) || Number(cartData.totalAmount) <= 0) {
    return {
      status: "error",
      message: `Total amount must be number and cannot be 0.`,
      data: {},
    };
  }
  if (!cartData.payableAmount || cartData.payableAmount === "") {
    return {
      status: "error",
      message: `Payable amount is required.`,
      data: {},
    };
  }
  if (isNaN(cartData.payableAmount) || Number(cartData.payableAmount) <= 0) {
    return {
      status: "error",
      message: `Payable amount must be number and cannot be 0.`,
      data: {},
    };
  }
};

module.exports.validationForNewOrder = async ({ req }) => {
  if (!req?.body?.customerID || req.body.customerID === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }
  const emailInfoValidationObj = await this.emailInfoValidation({
    req: req,
  });
  if (emailInfoValidationObj?.status === "error") {
    return emailInfoValidationObj;
  }

  const phoneInfoValidationObj = await this.phoneInfoValidation({
    req: req,
  });
  if (phoneInfoValidationObj?.status === "error") {
    return phoneInfoValidationObj;
  }

  const shippingInfoValidationObj = await this.shippingInfoValidation({
    req: req,
  });
  if (shippingInfoValidationObj?.status === "error") {
    return shippingInfoValidationObj;
  }

  const billingInfoValidationObj = await this.billingInfoValidation({
    req: req,
  });
  if (billingInfoValidationObj?.status === "error") {
    return billingInfoValidationObj;
  }

  const cardInfoValidationObj = await this.cardInfoValidation({
    req: req,
  });
  if (cardInfoValidationObj?.status === "error") {
    return cardInfoValidationObj;
  }

  const customerExistenceValidationObj = await this.customerExistenceValidation(
    {
      req: req,
    }
  );
  if (customerExistenceValidationObj?.status === "error") {
    return customerExistenceValidationObj;
  }

  const cartDataObj = await CartsUtility.getCartByCustomerIDUtil({
    req: req,
  });
  if (cartDataObj?.status === "error") {
    return cartDataObj;
  }
  const cartData = cartDataObj.data;

  const orderAmountValidationObj = await this.orderAmountValidation({
    cartData: cartData,
  });
  if (orderAmountValidationObj?.status === "error") {
    return orderAmountValidationObj;
  }

  const createdDataToBeAdded = await this.createNewOrderDataToBeAdded({
    req: req,
    cartData: cartData,
  });

  return {
    status: "success",
    message: `Order can be created.`,
    data: { dataToAdd: createdDataToBeAdded },
  };
};
