const WishlistsSchema = require("../../model/v3/wishlists");
const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");
const CustomersUtility = require("./customersUtility");
const ProductsUtility = require("./productsUtility");

module.exports.getSingleWishlistWithAllDetailsUtil = async ({
  wishlistData,
}) => {
  const customerByIdObject = await CommonUtility.getCustomerByIDForCommonUtil({
    customerID: wishlistData?.customerID,
  });
  const productByIdObject = await CommonUtility.getProductByIDForCommonUtil({
    productID: wishlistData?.productID,
  });

  return {
    id: wishlistData?.id ?? "",
    wishlistNumber: wishlistData?.wishlistNumber,
    code: wishlistData?.code,
    customerDetails: customerByIdObject.data,
    productDetails: productByIdObject.data,
    dateAdded: wishlistData?.dateAdded ?? new Date(),
    dateModified: wishlistData?.dateModified ?? new Date(),
  };
};

module.exports.getAllWishlistsArrWithAllDetailsUtil = async ({
  allWishlistsArr,
}) => {
  return Promise.all(
    allWishlistsArr?.map(async (wishlistData) => {
      const wishlistDetailsData =
        await this.getSingleWishlistWithAllDetailsUtil({
          wishlistData: wishlistData,
        });
      return wishlistDetailsData;
    })
  );
};

module.exports.getAllWishlistsUtil = async ({ req }) => {
  const foundWishlistDataObj = await CommonApisUtility.getAllDataFromSchemaUtil(
    {
      req: req,
      schema: WishlistsSchema,
      schemaName: "Wishlists",
      arrSortByKey: "wishlistNumber",
    }
  );

  if (foundWishlistDataObj?.status === "error") {
    return foundWishlistDataObj;
  }
  if (
    foundWishlistDataObj?.status === "success" &&
    (!foundWishlistDataObj?.data || foundWishlistDataObj.data.length <= 0)
  ) {
    return {
      status: "error",
      message: `There is no wishlist data exists.`,
      data: [],
    };
  }

  const fullDetailsDataArrObj = await this.getAllWishlistsArrWithAllDetailsUtil(
    {
      allWishlistsArr: foundWishlistDataObj.data,
    }
  );

  return {
    ...foundWishlistDataObj,
    data: fullDetailsDataArrObj,
  };
};

module.exports.getWishlistsByCustomerIDUtil = async ({ req }) => {
  if (!req?.body?.customerID || req.body.customerID === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: [],
    };
  }

  const customerID = req.body.customerID;
  const foundWishlistDataObj =
    await CommonApisUtility.getDataArrayByIdFromSchemaUtil({
      schema: WishlistsSchema,
      schemaName: "Wishlists",
      dataID: customerID,
      keyname: "customerID",
    });

  if (foundWishlistDataObj?.status === "error") {
    return {
      ...foundWishlistDataObj,
      message: `There is no wishlist exists with customer id ${customerID}`,
    };
  }
  if (
    foundWishlistDataObj?.status === "success" &&
    (!foundWishlistDataObj?.data || foundWishlistDataObj.data.length <= 0)
  ) {
    return {
      status: "error",
      message: `There is no wishlist exists with customer id ${customerID}`,
      data: [],
    };
  }

  const fullDetailsDataArrObj = await this.getAllWishlistsArrWithAllDetailsUtil(
    {
      allWishlistsArr: foundWishlistDataObj.data,
    }
  );

  return {
    ...foundWishlistDataObj,
    data: fullDetailsDataArrObj,
  };
};

module.exports.getWishlistsByProductIDUtil = async ({ req }) => {
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Product id is required.`,
      data: [],
    };
  }

  const productID = req.body.productID;
  const foundWishlistDataObj =
    await CommonApisUtility.getDataArrayByIdFromSchemaUtil({
      schema: WishlistsSchema,
      schemaName: "Wishlists",
      dataID: productID,
      keyname: "productID",
    });

  if (foundWishlistDataObj?.status === "error") {
    return {
      ...foundWishlistDataObj,
      message: `There is no wishlist exists with product id ${productID}`,
    };
  }
  if (
    foundWishlistDataObj?.status === "success" &&
    (!foundWishlistDataObj?.data || foundWishlistDataObj.data.length <= 0)
  ) {
    return {
      status: "error",
      message: `There is no wishlist exists with product id ${productID}`,
      data: [],
    };
  }

  const fullDetailsDataArrObj = await this.getAllWishlistsArrWithAllDetailsUtil(
    {
      allWishlistsArr: foundWishlistDataObj.data,
    }
  );

  return {
    ...foundWishlistDataObj,
    data: fullDetailsDataArrObj,
  };
};

module.exports.getWishlistByProductAndCustomerIDUtil = async ({ req }) => {
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Product id is required.`,
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

  const productID = req.body.productID;
  const customerID = req.body.customerID;

  const foundWishlistDataObj =
    await CommonApisUtility.getDataByDualKeysFromSchemaUtil({
      schema: WishlistsSchema,
      schemaName: "Wishlist",
      key1Value: customerID,
      key2Value: productID,
    });

  if (foundWishlistDataObj?.status === "error") {
    return {
      ...foundWishlistDataObj,
      message: `There is no wishlist exists with product id ${productID} and customer id ${customerID}`,
    };
  }
  if (
    foundWishlistDataObj?.status === "success" &&
    (!foundWishlistDataObj?.data ||
      Object.keys(foundWishlistDataObj.data).length <= 0)
  ) {
    return {
      status: "error",
      message: `There is no wishlist exists with product id ${productID} and customer id ${customerID}`,
      data: {},
    };
  }

  const fullDetailsDataObj = await this.getSingleWishlistWithAllDetailsUtil({
    wishlistData: foundWishlistDataObj.data,
  });

  return {
    ...foundWishlistDataObj,
    data: fullDetailsDataObj,
  };
};

module.exports.getNewWishlistNumberUtil = async ({ req }) => {
  const allWishlistsObj = await this.getAllWishlistsUtil({ req });
  const dataArr = allWishlistsObj?.data ?? [];

  let currentMaxWishlistNumber = 0;

  if (dataArr && dataArr.length > 0) {
    const wishlistNumbersArr = [];
    dataArr.map((wishlistData) => {
      wishlistNumbersArr.push(wishlistData.wishlistNumber);
    });
    const maxWishlistNumber = wishlistNumbersArr.reduce(function (
      prev,
      current
    ) {
      return prev && prev > current ? prev : current;
    });
    if (maxWishlistNumber) {
      currentMaxWishlistNumber = maxWishlistNumber ?? 0;
    }
  }
  const newWishlistNumber = currentMaxWishlistNumber + 1;
  return newWishlistNumber;
};

module.exports.addToWishlistUtil = async ({ req }) => {
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Product id is required.`,
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

  const productID = req.body.productID;
  const customerID = req.body.customerID;

  const foundProductExistsByProductID =
    await ProductsUtility.getProductByProductIDUtil({
      req: {
        body: {
          id: productID,
        },
      },
    });

  if (foundProductExistsByProductID?.status === "error") {
    return {
      status: "error",
      message: `Cannot add to wishlist. Product with provided product id ${productID} doesn't exists.`,
    };
  }

  const foundCustomerExistsByCustomerID =
    await CustomersUtility.getCustomerByIDUtil({
      req: {
        body: {
          id: customerID,
        },
      },
    });

  if (foundCustomerExistsByCustomerID?.status === "error") {
    return {
      status: "error",
      message: `Cannot add to wishlist. Customer with provided customer id ${customerID} doesn't exists.`,
    };
  }

  const foundExistingWishlist =
    await this.getWishlistByProductAndCustomerIDUtil({
      req: {
        body: {
          productID: productID,
          customerID: customerID,
        },
      },
    });

  if (foundExistingWishlist?.status === "success") {
    return {
      status: "error",
      message: `Product with product id ${productID} is already exists in wishlist for you.`,
      data: {},
    };
  }

  const newWishlistNumber = await this.getNewWishlistNumberUtil({ req });
  const paddedNewWishlistNumber = String(newWishlistNumber).padStart(9, "0");
  const wishlistCode = `Wish${paddedNewWishlistNumber}`;
  const wishlistID = CommonUtility.getUniqueID();
  const dateAdded = new Date();
  const dateModified = new Date();

  const newWishlistSchema = new WishlistsSchema({
    id: wishlistID,
    wishlistNumber: newWishlistNumber,
    code: wishlistCode,
    customerID: customerID,
    productID: productID,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  const newlyAddedDataObj = await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newWishlistSchema,
    schemaName: "Wishlist",
  });

  if (newlyAddedDataObj?.status === "error") {
    return newlyAddedDataObj;
  }

  const fullDetailsDataObj = await this.getSingleWishlistWithAllDetailsUtil({
    wishlistData: newlyAddedDataObj?.data,
  });

  return {
    ...newlyAddedDataObj,
    data: fullDetailsDataObj,
  };
};

module.exports.deleteFromWishlistUtil = async ({ req }) => {
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Product id is required.`,
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

  const productID = req.body.productID;
  const customerID = req.body.customerID;

  const foundExistingWishlist =
    await this.getWishlistByProductAndCustomerIDUtil({
      req: {
        body: {
          productID: productID,
          customerID: customerID,
        },
      },
    });

  if (foundExistingWishlist?.status === "error") {
    return {
      status: "error",
      message: `Product with product id ${productID} doesn't exists in wishlist for you.`,
      data: {},
    };
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: WishlistsSchema,
    schemaName: "Wishlist",
    dataID: foundExistingWishlist?.data?.id,
  });
};

module.exports.updateWishlistUtil = async ({ req }) => {
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Product id is required.`,
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

  const productID = req.body.productID;
  const customerID = req.body.customerID;

  const foundExistingWishlist =
    await this.getWishlistByProductAndCustomerIDUtil({
      req: {
        body: {
          productID: productID,
          customerID: customerID,
        },
      },
    });

  if (foundExistingWishlist?.status === "success") {
    const removedFromWishlistObj = await this.deleteFromWishlistUtil({
      req: req,
    });
    if (removedFromWishlistObj?.status === "success") {
      return {
        status: "success",
        message: `Wishlist is updated successfully. Product with ${productID} is removed from your wishlist.`,
        data: {},
      };
    }
    return {
      status: "error",
      message: `Wishlist cannot be updated due to an error. ${removedFromWishlistObj?.message}.`,
      data: {},
    };
  } else {
    const newlyAddedToWishlistObj = await this.addToWishlistUtil({
      req: req,
    });
    if (newlyAddedToWishlistObj?.status === "success") {
      return {
        status: "success",
        message: `Wishlist is updated successfully. Product with ${productID} is added to your wishlist.`,
        data: newlyAddedToWishlistObj?.data,
      };
    }
    return {
      status: "error",
      message: `Wishlist cannot be updated due to an error. ${newlyAddedToWishlistObj?.message}.`,
      data: {},
    };
  }
};
