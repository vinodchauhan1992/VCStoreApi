const RatingsSchema = require("../../model/v3/ratings");
const CustomersSchema = require("../../model/v3/customers");
const ProductsSchema = require("../../model/v3/products");
const CustomersUtility = require("./customersUtility");
const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");

module.exports.getCustomerByIDForRatingUtil = async ({ customerID }) => {
  const foundObj = await CustomersUtility.getCustomerByIDUtil({
    req: {
      body: {
        id: customerID,
      },
    },
  });

  if (
    foundObj?.status === "success" &&
    foundObj?.data &&
    Object.keys(foundObj.data).length > 0
  ) {
    return foundObj;
  }

  return {
    ...foundObj,
    data: { id: customerID },
  };
};

module.exports.getLikedDislikedAbusedByArrWithAllDetailsUtil = async ({
  itemsArr,
}) => {
  return Promise.all(
    itemsArr?.map(async (itemData) => {
      const itemDetailsData = await this.getCustomerByIDForRatingUtil({
        customerID: itemData.customerID,
      });
      return itemDetailsData.data;
    })
  );
};

module.exports.getSingleRatingWithAllDetailsUtil = async ({ ratingData }) => {
  const customerByIdObject = await this.getCustomerByIDForRatingUtil({
    customerID: ratingData?.customerID,
  });
  const updatedLikedByArr =
    await this.getLikedDislikedAbusedByArrWithAllDetailsUtil({
      itemsArr: ratingData?.likedBy ?? [],
    });
  const updatedDislikedByArr =
    await this.getLikedDislikedAbusedByArrWithAllDetailsUtil({
      itemsArr: ratingData?.dislikedBy ?? [],
    });
  const updatedAbusedByArr =
    await this.getLikedDislikedAbusedByArrWithAllDetailsUtil({
      itemsArr: ratingData?.abuseReportedBy ?? [],
    });

  return {
    id: ratingData?.id ?? "",
    customerDetails: customerByIdObject.data,
    productID: ratingData?.productID ?? "",
    review: ratingData?.review ?? "",
    ratings: ratingData?.ratings ?? "",
    likedBy: updatedLikedByArr ?? [],
    dislikedBy: updatedDislikedByArr ?? [],
    abuseReportedBy: updatedAbusedByArr ?? [],
    dateAdded: ratingData?.dateAdded ?? new Date(),
  };
};

module.exports.getAllRatingsArrWithAllDetailsUtil = async ({
  allRatingsArr,
}) => {
  return Promise.all(
    allRatingsArr?.map(async (ratingData) => {
      const ratingDetailsData = await this.getSingleRatingWithAllDetailsUtil({
        ratingData: ratingData,
      });
      return ratingDetailsData;
    })
  );
};

module.exports.getAllRatingsUtil = async ({ req }) => {
  const foundAllRatingsDataObj =
    await CommonApisUtility.getAllDataFromSchemaUtil({
      req: req,
      schema: RatingsSchema,
      schemaName: "Ratings",
    });

  if (
    foundAllRatingsDataObj?.status === "error" &&
    foundAllRatingsDataObj?.data?.length <= 0
  ) {
    return foundAllRatingsDataObj;
  }

  const fullDetailsRatingsArr = await this.getAllRatingsArrWithAllDetailsUtil({
    allRatingsArr: foundAllRatingsDataObj?.data,
  });

  return {
    ...foundAllRatingsDataObj,
    data: fullDetailsRatingsArr,
  };
};

module.exports.getAllLikedRatingsUtil = async ({ req }) => {
  const allRatingsDataObj = await this.getAllRatingsUtil({});

  if (
    allRatingsDataObj?.status === "error" ||
    !allRatingsDataObj?.data ||
    allRatingsDataObj.data.length <= 0
  ) {
    return {
      status: "error",
      message: `There are no ratings found.`,
      data: [],
    };
  }

  const allRatingsArr = allRatingsDataObj.data;
  const returnItems = [];
  allRatingsArr.map((ratingData) => {
    if (ratingData?.likedBy && ratingData.likedBy.length > 0) {
      returnItems.push(ratingData);
    }
  });

  if (returnItems.length <= 0) {
    return {
      status: "error",
      message: `There are no ratings found with likes`,
      data: [],
    };
  }

  return {
    status: "success",
    message: `Ratings found with likes.`,
    data: returnItems,
  };
};

module.exports.getAllDislikedRatingsUtil = async ({ req }) => {
  const allRatingsDataObj = await this.getAllRatingsUtil({});

  if (
    allRatingsDataObj?.status === "error" ||
    !allRatingsDataObj?.data ||
    allRatingsDataObj.data.length <= 0
  ) {
    return {
      status: "error",
      message: `There are no ratings found.`,
      data: [],
    };
  }

  const allRatingsArr = allRatingsDataObj.data;
  const returnItems = [];
  allRatingsArr.map((ratingData) => {
    if (ratingData?.dislikedBy && ratingData.dislikedBy.length > 0) {
      returnItems.push(ratingData);
    }
  });

  if (returnItems.length <= 0) {
    return {
      status: "error",
      message: `There are no ratings found with dislikes`,
      data: [],
    };
  }

  return {
    status: "success",
    message: `Ratings found with dislikes.`,
    data: returnItems,
  };
};

module.exports.getAllAbusedRatingsUtil = async ({ req }) => {
  const allRatingsDataObj = await this.getAllRatingsUtil({});

  if (
    allRatingsDataObj?.status === "error" ||
    !allRatingsDataObj?.data ||
    allRatingsDataObj.data.length <= 0
  ) {
    return {
      status: "error",
      message: `There are no ratings found.`,
      data: [],
    };
  }

  const allRatingsArr = allRatingsDataObj.data;
  const returnItems = [];
  allRatingsArr.map((ratingData) => {
    if (ratingData?.abuseReportedBy && ratingData.abuseReportedBy.length > 0) {
      returnItems.push(ratingData);
    }
  });

  if (returnItems.length <= 0) {
    return {
      status: "error",
      message: `There are no ratings found which are reported abused`,
      data: [],
    };
  }

  return {
    status: "success",
    message: `Ratings found which are reported abused.`,
    data: returnItems,
  };
};

module.exports.getRatingByRatingIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Rating id is required.`,
      data: {},
    };
  }

  const ratingID = req.body.id;

  const foundDataByIDObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: RatingsSchema,
    schemaName: "Rating",
    dataID: ratingID,
  });

  if (foundDataByIDObj?.status === "error") {
    return foundDataByIDObj;
  }

  const fullDetailsDataObj = await this.getSingleRatingWithAllDetailsUtil({
    ratingData: foundDataByIDObj?.data,
  });

  return {
    status: "success",
    message: `Ratings data found with rating id ${ratingID}.`,
    data: fullDetailsDataObj,
  };
};

module.exports.getRatingsByCustomerIDUtil = async ({ req }) => {
  if (!req?.body?.customerID || req.body.customerID === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }

  const customerID = req.body.customerID;

  const foundDataByIDObj =
    await CommonApisUtility.getDataArrayByIdFromSchemaUtil({
      schema: RatingsSchema,
      schemaName: "Ratings",
      dataID: customerID,
      keyname: "customerID",
    });

  if (
    foundDataByIDObj?.status === "error" ||
    !foundDataByIDObj?.data ||
    foundDataByIDObj.data.length <= 0
  ) {
    return {
      ...foundDataByIDObj,
      message: `There are no ratings exists for customer id ${customerID}.`,
    };
  }

  const fullDetailsArrDataObj = await this.getAllRatingsArrWithAllDetailsUtil({
    allRatingsArr: foundDataByIDObj?.data,
  });

  return {
    status: "success",
    message: `Ratings data found with customer id ${customerID}.`,
    data: fullDetailsArrDataObj,
  };
};

module.exports.getRatingsByProductIDUtil = async ({ req }) => {
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Product id is required.`,
      data: {},
    };
  }

  const productID = req.body.productID;

  const foundDataByIDObj =
    await CommonApisUtility.getDataArrayByIdFromSchemaUtil({
      schema: RatingsSchema,
      schemaName: "Ratings",
      dataID: productID,
      keyname: "productID",
    });

  if (
    foundDataByIDObj?.status === "error" ||
    !foundDataByIDObj?.data ||
    foundDataByIDObj.data.length <= 0
  ) {
    return {
      ...foundDataByIDObj,
      message: `There are no ratings exists for product id ${productID}.`,
    };
  }

  const fullDetailsArrDataObj = await this.getAllRatingsArrWithAllDetailsUtil({
    allRatingsArr: foundDataByIDObj?.data,
  });

  return {
    status: "success",
    message: `Ratings data found with product id ${productID}.`,
    data: fullDetailsArrDataObj,
  };
};

module.exports.checkCustomerExistenceUtil = async ({ req }) => {
  if (!req?.body?.customerID || req.body.customerID === "") {
    return {
      status: "error",
      message: `Customer id is required.`,
      data: {},
    };
  }

  const customerID = req.body.customerID;
  const foundCustomerByIDObj =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: CustomersSchema,
      schemaName: "Customer",
      dataID: customerID,
    });

  if (foundCustomerByIDObj?.status === "error") {
    return {
      status: "error",
      message: `Rating cannot be added. ${foundCustomerByIDObj?.message}`,
      data: {},
    };
  }
  return {
    status: "success",
    message: `Rating can be added. ${foundCustomerByIDObj?.message}`,
    data: foundCustomerByIDObj?.data,
  };
};

module.exports.checkProductExistenceUtil = async ({ req }) => {
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Product id is required.`,
      data: {},
    };
  }

  const productID = req.body.productID;
  const foundProductByIDObj = await CommonApisUtility.getDataByIdFromSchemaUtil(
    {
      schema: ProductsSchema,
      schemaName: "Product",
      dataID: productID,
    }
  );

  if (foundProductByIDObj?.status === "error") {
    return {
      status: "error",
      message: `Rating cannot be added. ${foundProductByIDObj?.message}`,
      data: {},
    };
  }
  return {
    status: "success",
    message: `Rating can be added. ${foundProductByIDObj?.message}`,
    data: foundProductByIDObj?.data,
  };
};

module.exports.addNewRatingUtil = async ({ req }) => {
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
  if (!req?.body?.review || req.body.review === "") {
    return {
      status: "error",
      message: `Review description is required.`,
      data: {},
    };
  }
  if (!req?.body?.maxRating || req.body.maxRating === "") {
    return {
      status: "error",
      message: `Max rating is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.maxRating)) {
    return {
      status: "error",
      message: `Max rating must be a number.`,
      data: {},
    };
  }
  if (!req?.body?.rating || req.body.rating === "") {
    return {
      status: "error",
      message: `Rating is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.rating)) {
    return {
      status: "error",
      message: `Rating must be a number.`,
      data: {},
    };
  }

  const maxRating = req.body.maxRating;
  const rating = req.body.rating;
  if (rating > maxRating) {
    return {
      status: "error",
      message: `Rating cannot be more than max rating.`,
      data: {},
    };
  }

  const ratingID = CommonUtility.getUniqueID();
  const customerID = req.body.customerID;
  const productID = req.body.productID;
  const review = req.body.review;
  const dateAdded = new Date();

  const customerExistenceObj = await this.checkCustomerExistenceUtil({
    req: req,
  });
  if (customerExistenceObj?.status === "error") {
    return customerExistenceObj;
  }

  const productExistenceObj = await this.checkProductExistenceUtil({
    req: req,
  });
  if (productExistenceObj?.status === "error") {
    return productExistenceObj;
  }

  const foundRatingObj =
    await CommonApisUtility.getDataByDualKeysFromSchemaUtil({
      schema: RatingsSchema,
      schemaName: "Rating",
      key1Value: customerID,
      key2Value: productID,
    });

  if (foundRatingObj?.status === "success") {
    return {
      status: "error",
      message: `Rating by customer with customer id ${customerID} for product with product id ${productID} is already exists.`,
      data: {},
    };
  }

  const newRatingSchema = new RatingsSchema({
    id: ratingID,
    customerID: customerID,
    productID: productID,
    review: review,
    ratings: {
      maxRating: maxRating,
      rating: rating,
    },
    likedBy: [],
    dislikedBy: [],
    abuseReportedBy: [],
    dateAdded: dateAdded,
  });

  const newlyAddedDataObj = await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newRatingSchema,
    schemaName: "Rating",
  });
  if (newlyAddedDataObj?.status === "error") {
    return newlyAddedDataObj;
  }

  const fullRatingDetailsData = await this.getSingleRatingWithAllDetailsUtil({
    ratingData: newlyAddedDataObj?.data,
  });

  return {
    ...newlyAddedDataObj,
    data: fullRatingDetailsData,
  };
};

module.exports.deleteRatingUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Rating id is required.`,
      data: {},
    };
  }

  const ratingID = req.body.id;

  const foundRatingByIDObj = await this.getRatingByRatingIDUtil({
    req: {
      body: {
        id: ratingID,
      },
    },
  });
  if (foundRatingByIDObj?.status === "error") {
    return foundRatingByIDObj;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: RatingsSchema,
    schemaName: "Rating",
    dataID: ratingID,
  });
};

module.exports.getUpdatedLikingUtil = async ({
  foundRatingByIDObj,
  customerID,
}) => {
  let updatedLikedByArr = foundRatingByIDObj?.data?.likedBy ?? [];
  let updatedDislikedByArr = foundRatingByIDObj?.data?.dislikedBy ?? [];
  const foundLikedByObj = updatedLikedByArr?.find(
    (likedByData) => likedByData?.customerID === customerID
  );

  if (foundLikedByObj?.customerID) {
    const foundLikedByIndex = updatedLikedByArr?.findIndex(
      (likedByData) => likedByData?.customerID === customerID
    );
    if (foundLikedByIndex !== -1 && foundLikedByIndex !== undefined) {
      updatedLikedByArr.splice(foundLikedByIndex, 1);
    }
  } else {
    updatedLikedByArr.push({ customerID: customerID });
    const foundDislikedByIndex = updatedDislikedByArr?.findIndex(
      (dislikedByData) => dislikedByData?.customerID === customerID
    );
    if (foundDislikedByIndex !== -1 && foundDislikedByIndex !== undefined) {
      updatedDislikedByArr.splice(foundDislikedByIndex, 1);
    }
  }
  return { updatedLikedByArr, updatedDislikedByArr };
};

module.exports.updateLikeToRatingUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Rating id is required.`,
      data: {},
    };
  }
  if (!req?.body?.customerID || req.body.customerID === "") {
    return {
      status: "error",
      message: `Liked by customer id is required.`,
      data: {},
    };
  }

  const ratingID = req.body.id;
  const customerID = req.body.customerID;
  const dateModified = new Date();

  const foundCustomerByIDObj =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: CustomersSchema,
      schemaName: "Customer",
      dataID: customerID,
    });
  if (foundCustomerByIDObj?.status === "error") {
    return foundCustomerByIDObj;
  }

  const foundRatingByIDObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: RatingsSchema,
    schemaName: "Rating",
    dataID: ratingID,
  });
  if (foundRatingByIDObj?.status === "error") {
    return foundRatingByIDObj;
  }

  const { updatedLikedByArr, updatedDislikedByArr } =
    await this.getUpdatedLikingUtil({
      foundRatingByIDObj: foundRatingByIDObj,
      customerID: customerID,
    });

  const newRating = {
    id: ratingID,
    likedBy: updatedLikedByArr,
    dislikedBy: updatedDislikedByArr,
    dateModified: dateModified,
  };

  const updatedRatingSet = {
    $set: newRating,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: RatingsSchema,
    schemaName: "Rating",
    newDataObject: newRating,
    updatedDataSet: updatedRatingSet,
    dataID: ratingID,
  });
};

module.exports.getUpdatedDisLikingUtil = async ({
  foundRatingByIDObj,
  customerID,
}) => {
  let updatedLikedByArr = foundRatingByIDObj?.data?.likedBy ?? [];
  let updatedDislikedByArr = foundRatingByIDObj?.data?.dislikedBy ?? [];
  const foundDislikedByObj = updatedDislikedByArr?.find(
    (dislikedByData) => dislikedByData?.customerID === customerID
  );

  if (foundDislikedByObj?.customerID) {
    const foundDislikedByIndex = updatedDislikedByArr?.findIndex(
      (dislikedByData) => dislikedByData?.customerID === customerID
    );
    if (foundDislikedByIndex !== -1 && foundDislikedByIndex !== undefined) {
      updatedDislikedByArr.splice(foundDislikedByIndex, 1);
    }
  } else {
    updatedDislikedByArr.push({ customerID: customerID });
    const foundLikedByIndex = updatedLikedByArr?.findIndex(
      (likedByData) => likedByData?.customerID === customerID
    );
    if (foundLikedByIndex !== -1 && foundLikedByIndex !== undefined) {
      updatedLikedByArr.splice(foundLikedByIndex, 1);
    }
  }
  return { updatedLikedByArr, updatedDislikedByArr };
};

module.exports.updateDislikeToRatingUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Rating id is required.`,
      data: {},
    };
  }
  if (!req?.body?.customerID || req.body.customerID === "") {
    return {
      status: "error",
      message: `Disliked by customer id is required.`,
      data: {},
    };
  }

  const ratingID = req.body.id;
  const customerID = req.body.customerID;
  const dateModified = new Date();

  const foundCustomerByIDObj =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: CustomersSchema,
      schemaName: "Customer",
      dataID: customerID,
    });
  if (foundCustomerByIDObj?.status === "error") {
    return foundCustomerByIDObj;
  }

  const foundRatingByIDObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: RatingsSchema,
    schemaName: "Rating",
    dataID: ratingID,
  });
  if (foundRatingByIDObj?.status === "error") {
    return foundRatingByIDObj;
  }

  const { updatedLikedByArr, updatedDislikedByArr } =
    await this.getUpdatedDisLikingUtil({
      foundRatingByIDObj: foundRatingByIDObj,
      customerID: customerID,
    });

  const newRating = {
    id: ratingID,
    likedBy: updatedLikedByArr,
    dislikedBy: updatedDislikedByArr,
    dateModified: dateModified,
  };

  const updatedRatingSet = {
    $set: newRating,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: RatingsSchema,
    schemaName: "Rating",
    newDataObject: newRating,
    updatedDataSet: updatedRatingSet,
    dataID: ratingID,
  });
};

module.exports.getUpdatedAbuseReportedByUtil = async ({
  foundRatingByIDObj,
  customerID,
}) => {
  let updatedAbuseReportedByArr =
    foundRatingByIDObj?.data?.abuseReportedBy ?? [];
  const foundAbuseReportedByObj = updatedAbuseReportedByArr?.find(
    (abuseReportedByData) => abuseReportedByData?.customerID === customerID
  );

  if (foundAbuseReportedByObj?.customerID) {
    const foundAbuseReportedByIndex = updatedAbuseReportedByArr?.findIndex(
      (abuseReportedByData) => abuseReportedByData?.customerID === customerID
    );
    if (
      foundAbuseReportedByIndex !== -1 &&
      foundAbuseReportedByIndex !== undefined
    ) {
      updatedAbuseReportedByArr.splice(foundAbuseReportedByIndex, 1);
    }
  } else {
    updatedAbuseReportedByArr.push({ customerID: customerID });
  }
  return { updatedAbuseReportedByArr };
};

module.exports.updateAbuseReportedForRatingUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Rating id is required.`,
      data: {},
    };
  }
  if (!req?.body?.customerID || req.body.customerID === "") {
    return {
      status: "error",
      message: `Disliked by customer id is required.`,
      data: {},
    };
  }

  const ratingID = req.body.id;
  const customerID = req.body.customerID;
  const dateModified = new Date();

  const foundCustomerByIDObj =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: CustomersSchema,
      schemaName: "Customer",
      dataID: customerID,
    });
  if (foundCustomerByIDObj?.status === "error") {
    return foundCustomerByIDObj;
  }

  const foundRatingByIDObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: RatingsSchema,
    schemaName: "Rating",
    dataID: ratingID,
  });
  if (foundRatingByIDObj?.status === "error") {
    return foundRatingByIDObj;
  }

  const { updatedAbuseReportedByArr } =
    await this.getUpdatedAbuseReportedByUtil({
      foundRatingByIDObj: foundRatingByIDObj,
      customerID: customerID,
    });

  const newRating = {
    id: ratingID,
    abuseReportedBy: updatedAbuseReportedByArr,
    dateModified: dateModified,
  };

  const updatedRatingSet = {
    $set: newRating,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: RatingsSchema,
    schemaName: "Rating",
    newDataObject: newRating,
    updatedDataSet: updatedRatingSet,
    dataID: ratingID,
  });
};
