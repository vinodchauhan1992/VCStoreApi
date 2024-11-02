const CartsSchema = require("../../model/v3/carts");
const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");
const CustomersUtility = require("./customersUtility");
const ProductsUtility = require("./productsUtility");

module.exports.getSingleProductDetailsUtil = async ({ productData }) => {
  const productByIdObject = await CommonUtility.getProductByIDForCommonUtil({
    productID: productData?.productID,
  });

  return {
    productDetails: productByIdObject.data,
    count: productData?.count ?? 1,
  };
};

module.exports.getAllProductsArrForACustomerCartUtil = async ({
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

module.exports.getSingleCartWithAllDetailsUtil = async ({ cartData }) => {
  const customerByIdObject = await CommonUtility.getCustomerByIDForCommonUtil({
    customerID: cartData?.customerID,
  });
  const productsWithFullDetails =
    await this.getAllProductsArrForACustomerCartUtil({
      productsArr: cartData?.products ?? [],
    });

  return {
    id: cartData?.id ?? "",
    cartNumber: cartData?.cartNumber ?? "",
    code: cartData?.code ?? "",
    customerDetails: customerByIdObject.data,
    products: productsWithFullDetails ?? [],
    totalAmount: cartData?.totalAmount ?? 0.0,
    discount: cartData?.discount ?? 0.0,
    couponDiscount: cartData?.couponDiscount ?? 0.0,
    payableAmount: cartData?.payableAmount ?? 0.0,
    dateAdded: cartData?.dateAdded ?? new Date(),
    dateModified: cartData?.dateModified ?? new Date(),
  };
};

module.exports.getAllCartsArrWithAllDetailsUtil = async ({ allCartsArr }) => {
  return Promise.all(
    allCartsArr?.map(async (cartData) => {
      const cartDetailsData = await this.getSingleCartWithAllDetailsUtil({
        cartData: cartData,
      });
      return cartDetailsData;
    })
  );
};

module.exports.getAllCartsUtil = async ({ req }) => {
  const allCartsDataObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: CartsSchema,
    schemaName: "Carts",
    arrSortByKey: "cartNumber",
  });

  if (allCartsDataObj?.status === "error") {
    return allCartsDataObj;
  }

  const fullDetailsDataArr = await this.getAllCartsArrWithAllDetailsUtil({
    allCartsArr: allCartsDataObj?.data ?? [],
  });
  return {
    ...allCartsDataObj,
    data: fullDetailsDataArr,
  };
};

module.exports.getCartByCustomerIDUtil = async ({ req }) => {
  if (!req?.body?.customerID || req.body.customerID === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }

  const customerID = req.body.customerID;
  const foundCartByCustIDObj =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: CartsSchema,
      schemaName: "Cart",
      dataID: customerID,
      keyname: "customerID",
    });

  if (foundCartByCustIDObj?.status === "error") {
    return {
      ...foundCartByCustIDObj,
      message: `There is no cart exists by customer id ${customerID}.`,
    };
  }

  const fullDetailsData = await this.getSingleCartWithAllDetailsUtil({
    cartData: foundCartByCustIDObj?.data,
  });

  return {
    ...foundCartByCustIDObj,
    message: `Cart found by customer id ${customerID}.`,
    data: fullDetailsData,
  };
};

module.exports.getCartByCartIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Cart id is required.`,
      data: {},
    };
  }

  const cartID = req.body.id;
  const foundCartByCartIDObj =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: CartsSchema,
      schemaName: "Cart",
      dataID: cartID,
    });

  if (foundCartByCartIDObj?.status === "error") {
    return foundCartByCartIDObj;
  }

  const fullDetailsData = await this.getSingleCartWithAllDetailsUtil({
    cartData: foundCartByCartIDObj?.data,
  });

  return {
    ...foundCartByCartIDObj,
    data: fullDetailsData,
  };
};

module.exports.deleteCartUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Cart id is required.`,
      data: {},
    };
  }
  const cartID = req.body.id;

  const foundCartByCartIDObj = await this.getCartByCartIDUtil({
    req: req,
  });

  if (foundCartByCartIDObj?.status === "error") {
    return foundCartByCartIDObj;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: CartsSchema,
    schemaName: "Cart",
    dataID: cartID,
  });
};

module.exports.deleteFromCartUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Cart id is required.`,
      data: {},
    };
  }
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Cart product id is required.`,
      data: {},
    };
  }

  const cartID = req.body.id;
  const productID = req.body.productID;

  const foundCartByCartIDObj =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: CartsSchema,
      schemaName: "Cart",
      dataID: cartID,
    });

  if (foundCartByCartIDObj?.status === "error") {
    return foundCartByCartIDObj;
  }

  const cartDataObj = foundCartByCartIDObj?.data;
  const productsArr = cartDataObj?.products ?? [];
  const foundObjIndex = productsArr?.findIndex(
    (prodData) => prodData?.productID === productID
  );

  if (
    foundObjIndex === undefined ||
    foundObjIndex === null ||
    foundObjIndex === -1
  ) {
    return {
      status: "error",
      message: `Cart cannot be updated with cart id ${cartID} and product id ${productID} as product not found in cart.`,
      data: {},
    };
  }
  productsArr.splice(foundObjIndex, 1);

  if (productsArr.length <= 0) {
    // DELETE THE CART
    return await this.deleteCartUtil({ req: req });
  }
  // JUST UPDATE THE CART
  const updatedCartSchema = {
    id: cartID,
    products: productsArr,
    dateModified: new Date(),
  };

  const updatedCartDataSet = {
    $set: updatedCartSchema,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: CartsSchema,
    newDataObject: updatedCartSchema,
    updatedDataSet: updatedCartDataSet,
    schemaName: "Cart",
    dataID: cartID,
  });
};

module.exports.removeFromCartUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Cart id is required.`,
      data: {},
    };
  }
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Cart product id is required.`,
      data: {},
    };
  }
  if (req?.body?.productCount === undefined || req.body.productCount === "") {
    return {
      status: "error",
      message: `Product count is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.productCount)) {
    return {
      status: "error",
      message: `Product count must be a number.`,
      data: {},
    };
  }

  const cartID = req.body.id;
  const productID = req.body.productID;
  const productCount = req.body.productCount;

  const foundCartByCartIDObj =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: CartsSchema,
      schemaName: "Cart",
      dataID: cartID,
    });

  if (foundCartByCartIDObj?.status === "error") {
    return foundCartByCartIDObj;
  }

  const cartDataObj = foundCartByCartIDObj?.data;
  let productsArr = cartDataObj?.products ?? [];
  const foundObjIndex = productsArr?.findIndex(
    (prodData) => prodData?.productID === productID
  );

  if (
    foundObjIndex === undefined ||
    foundObjIndex === null ||
    foundObjIndex === -1
  ) {
    return {
      status: "error",
      message: `Cart cannot be updated with cart id ${cartID} and product id ${productID} as product not found in cart.`,
      data: {},
    };
  }

  const prodObj = productsArr[foundObjIndex];
  if (productCount <= 0) {
    // DELETE PRODUCT FROM CART
    return await this.deleteFromCartUtil({ req: req });
  }
  // JUST UPDATE THE ARRAY
  const updatedProdObj = {
    productID: prodObj.productID,
    count: productCount,
  };
  productsArr.splice(foundObjIndex, 1);
  productsArr.push(updatedProdObj);

  const updatedCartSchema = {
    id: cartID,
    products: productsArr,
    dateModified: new Date(),
  };

  const updatedCartDataSet = {
    $set: updatedCartSchema,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: CartsSchema,
    newDataObject: updatedCartSchema,
    updatedDataSet: updatedCartDataSet,
    schemaName: "Cart",
    dataID: cartID,
  });
};

module.exports.getNewCartNumberUtil = async ({ req }) => {
  const allItemsObj = await this.getAllCartsUtil({
    req,
  });
  const dataArr = allItemsObj?.data ?? [];

  let currentMaxItemNumber = 0;

  if (dataArr && dataArr.length > 0) {
    const itemNumbersArr = [];
    dataArr.map((item) => {
      itemNumbersArr.push(item.cartNumber);
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

module.exports.addNewCartUtil = async ({ req }) => {
  if (!req?.body?.customerID || req.body.customerID === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Product id is required.`,
      data: {},
    };
  }
  if (req?.body?.productCount === undefined || req.body.productCount === "") {
    return {
      status: "error",
      message: `Product count is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.productCount)) {
    return {
      status: "error",
      message: `Product count must be a number.`,
      data: {},
    };
  }

  const newCartNumber = await this.getNewCartNumberUtil({
    req,
  });
  const paddedNewCartNumber = String(newCartNumber).padStart(9, "0");
  const code = `Cart${paddedNewCartNumber}`;
  const cartID = CommonUtility.getUniqueID();
  const customerID = req.body.customerID;
  const productID = req.body.productID;
  const productCount = req.body.productCount;
  const dateAdded = new Date();
  const dateModified = new Date();

  const foundCustomerByCustIDObj = await CustomersUtility.getCustomerByIDUtil({
    req: {
      body: {
        id: customerID,
      },
    },
  });
  if (foundCustomerByCustIDObj?.status === "error") {
    return {
      ...foundCustomerByCustIDObj,
      message: `Item cannot be added to cart. Customer with customer id ${customerID} not found.`,
    };
  }

  const foundProductByProdIDObj =
    await ProductsUtility.getProductByProductIDUtil({
      req: {
        body: {
          id: productID,
        },
      },
    });
  if (foundProductByProdIDObj?.status === "error") {
    return {
      ...foundProductByProdIDObj,
      message: `Item cannot be added to cart. Product with product id ${productID} not found.`,
    };
  }

  const foundCartExistenceByCustIDObj = await this.getCartByCustomerIDUtil({
    req: req,
  });
  if (foundCartExistenceByCustIDObj?.status === "success") {
    return {
      status: "error",
      message: `Cart for customer id ${customerID} is already exists.`,
      data: {},
    };
  }

  const newCartSchema = new CartsSchema({
    id: cartID,
    cartNumber: newCartNumber,
    code: code,
    customerID: customerID,
    products: [
      {
        productID: productID,
        count: Number(productCount),
      },
    ],
    totalAmount: 0.0,
    discount: 0.0,
    couponDiscount: 0.0,
    payableAmount: 0.0,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  const newlyAddedCartObj = await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newCartSchema,
    schemaName: "Cart",
  });

  const fullDetailsData = await this.getSingleCartWithAllDetailsUtil({
    cartData: newlyAddedCartObj?.data,
  });

  return {
    ...newlyAddedCartObj,
    data: fullDetailsData,
  };
};

module.exports.addItemToCartUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Cart id is required.`,
      data: {},
    };
  }
  if (!req?.body?.customerID || req.body.customerID === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Product id is required.`,
      data: {},
    };
  }
  if (req?.body?.productCount === undefined || req.body.productCount === "") {
    return {
      status: "error",
      message: `Product count is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.productCount)) {
    return {
      status: "error",
      message: `Product count must be a number.`,
      data: {},
    };
  }

  const cartID = req.body.id;
  const customerID = req.body.customerID;
  const productID = req.body.productID;
  const dateModified = new Date();
  const productCount = req.body.productCount;

  const foundCustomerByCustIDObj = await CustomersUtility.getCustomerByIDUtil({
    req: {
      body: {
        id: customerID,
      },
    },
  });
  if (foundCustomerByCustIDObj?.status === "error") {
    return {
      ...foundCustomerByCustIDObj,
      message: `Item cannot be added to cart. Customer with customer id ${customerID} not found.`,
    };
  }

  const foundProductByProdIDObj =
    await ProductsUtility.getProductByProductIDUtil({
      req: {
        body: {
          id: productID,
        },
      },
    });
  if (foundProductByProdIDObj?.status === "error") {
    return {
      ...foundProductByProdIDObj,
      message: `Item cannot be added to cart. Product with product id ${productID} not found.`,
    };
  }

  const foundCartExistenceByCustIDObj =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: CartsSchema,
      schemaName: "Cart",
      dataID: customerID,
      keyname: "customerID",
    });
  if (foundCartExistenceByCustIDObj?.status === "error") {
    return foundCartExistenceByCustIDObj;
  }

  let productsArr = foundCartExistenceByCustIDObj?.data?.products ?? [];
  const foundProductIndex = productsArr?.findIndex(
    (prodData) => prodData?.productID === productID
  );

  if (
    foundProductIndex !== undefined &&
    foundProductIndex !== null &&
    foundProductIndex !== -1
  ) {
    // Product exists - need to increase the count
    const prodObj = productsArr[foundProductIndex];
    const updatedProdObj = {
      productID: prodObj.productID,
      count: productCount,
    };
    productsArr.splice(foundProductIndex, 1);
    productsArr.push(updatedProdObj);
  } else {
    // Product doesn't exist - need to push the product
    productsArr.push({ productID: productID, count: productCount });
  }

  const updatedCartSchema = {
    id: cartID,
    products: productsArr,
    dateModified: dateModified,
  };

  const updatedCartDataSet = {
    $set: updatedCartSchema,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: CartsSchema,
    newDataObject: updatedCartSchema,
    updatedDataSet: updatedCartDataSet,
    schemaName: "Cart",
    dataID: cartID,
  });
};

module.exports.updateCartUtil = async ({ req }) => {
  if (req?.body?.id && req.body.id !== "") {
    // Cart Already Exists
    if (!req?.body?.operation || req.body.operation === "") {
      return {
        status: "error",
        message: `Operation is required.`,
        data: {},
      };
    }
    if (req.body.operation === "delete_item_from_cart") {
      // deletes a product from cart
      return await this.deleteFromCartUtil({ req: req });
    }
    if (req.body.operation === "remove_item_from_cart") {
      // removes a product count from cart
      return await this.removeFromCartUtil({ req: req });
    }
    if (req.body.operation === "add_item_to_cart") {
      // add new product or increase product count in cart
      return await this.addItemToCartUtil({ req: req });
    }
    if (req.body.operation === "delete_cart") {
      // delete whole cart
      return await this.deleteCartUtil({ req: req });
    }
    return {
      status: "error",
      message: `Provided operation is invalid. Valid operations are "delete_item_from_cart", "remove_item_from_cart", "add_item_to_cart" and "delete_cart".`,
      data: {},
    };
  }
  // Cart Does not Exists. Add new cart
  return await this.addNewCartUtil({ req: req });
};

module.exports.getCartTotalPrices = async ({ productsArr, couponDiscount }) => {
  let totalSellingPrice = 0;
  let totalDiscountPrice = 0;
  let totalDiscountedPrice = 0;

  if (productsArr && productsArr.length > 0) {
    productsArr.map((prodData) => {
      const sellingPrice =
        prodData?.productDetails?.priceDetails?.sellingPrice ?? 0;
      const discountPrice =
        prodData?.productDetails?.priceDetails?.maxDiscountValue ?? 0;
      const discountedPrice =
        prodData?.productDetails?.priceDetails?.discountedPrice ?? 0;
      const count = prodData?.count ?? 1;
      totalSellingPrice = totalSellingPrice + sellingPrice * count;
      totalDiscountPrice = totalDiscountPrice + discountPrice * count;
      totalDiscountedPrice = totalDiscountedPrice + discountedPrice * count;
      return true;
    });
  }
  const totalPayableAmount =
    totalSellingPrice -
    totalDiscountPrice -
    (couponDiscount ? couponDiscount : 0);
  return {
    totalSellingPrice,
    totalDiscountPrice,
    totalPayableAmount,
    totalDiscountedPrice,
  };
};

module.exports.createCartUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Cart id is required.`,
      data: {},
    };
  }
  const cartID = req.body.id;
  const foundCartDataByIDObj = await this.getCartByCartIDUtil({ req });
  if (foundCartDataByIDObj?.status === "error") {
    return foundCartDataByIDObj;
  }
  if (
    !foundCartDataByIDObj?.data ||
    Object.keys(foundCartDataByIDObj.data).length <= 0
  ) {
    return {
      status: "error",
      message: `There is no cart exists with cart id ${cartID}.`,
      data: {},
    };
  }

  const cartData = foundCartDataByIDObj.data;
  const couponDiscount = req?.body?.couponDiscount
    ? CommonUtility.amountRoundingFunc({
        value: Number(req.body.couponDiscount),
      })
    : 0.0;
  const { totalSellingPrice, totalPayableAmount, totalDiscountPrice } =
    await this.getCartTotalPrices({
      productsArr: cartData?.products ?? [],
      couponDiscount: couponDiscount,
    });

  if (totalSellingPrice <= 0) {
    return {
      status: "error",
      message: `Total amount cannot be 0.`,
      data: {},
    };
  }
  if (totalPayableAmount <= 0) {
    return {
      status: "error",
      message: `Payable amount cannot be 0.`,
      data: {},
    };
  }

  const totalAmount = CommonUtility.amountRoundingFunc({
    value: totalSellingPrice,
  });
  const discount = totalDiscountPrice
    ? CommonUtility.amountRoundingFunc({ value: totalDiscountPrice })
    : 0.0;
  const payableAmount = CommonUtility.amountRoundingFunc({
    value: totalPayableAmount,
  });

  const updatedCartSchema = {
    id: cartID,
    totalAmount: totalAmount,
    discount: discount,
    couponDiscount: couponDiscount,
    payableAmount: payableAmount,
    dateModified: new Date(),
  };

  const updatedCartDataSet = {
    $set: updatedCartSchema,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: CartsSchema,
    newDataObject: updatedCartSchema,
    updatedDataSet: updatedCartDataSet,
    schemaName: "Cart",
    dataID: cartID,
  });
};
