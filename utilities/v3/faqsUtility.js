const FaqsSchema = require("../../model/v3/faqs");
const CustomersSchema = require("../../model/v3/customers");

const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");
const ProductsUtility = require("./productsUtility");
const CustomersUtility = require("./customersUtility");

module.exports.getCustomerByIDForFaqUtil = async ({ customerID }) => {
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

module.exports.getLikedDislikedArrWithAllDetailsUtil = async ({ itemsArr }) => {
  return Promise.all(
    itemsArr?.map(async (itemData) => {
      const itemDetailsData = await this.getCustomerByIDForFaqUtil({
        customerID: itemData.customerID,
      });
      return itemDetailsData.data;
    })
  );
};

module.exports.getSingleCustomerForAnswerUtil = async ({ answerData }) => {
  const customerByIdObject = await this.getCustomerByIDForFaqUtil({
    customerID: answerData?.customerID,
  });
  const updatedLikedByArr = await this.getLikedDislikedArrWithAllDetailsUtil({
    itemsArr: answerData?.likedBy ?? [],
  });
  const updatedDislikedByArr = await this.getLikedDislikedArrWithAllDetailsUtil(
    {
      itemsArr: answerData?.dislikedBy ?? [],
    }
  );

  return {
    answerID: answerData?.answerID ?? "",
    answer: answerData?.answer ?? "",
    customerDetails: customerByIdObject.data,
    likedBy: updatedLikedByArr ?? [],
    dislikedBy: updatedDislikedByArr ?? [],
    dateAdded: answerData?.dateAdded,
  };
};

module.exports.getCustomerForAllAnswersArrUtil = async ({ allAnswersArr }) => {
  return Promise.all(
    allAnswersArr?.map(async (answerData) => {
      const answerDetailsData = await this.getSingleCustomerForAnswerUtil({
        answerData: answerData,
      });
      return answerDetailsData;
    })
  );
};

module.exports.getSingleFaqWithAllDetailsUtil = async ({ faqData }) => {
  const customerByIdObject = await this.getCustomerByIDForFaqUtil({
    customerID: faqData?.questionDetails?.customerID,
  });
  const redefinedAnswersArr = await this.getCustomerForAllAnswersArrUtil({
    allAnswersArr: faqData?.answers ?? [],
  });

  return {
    id: faqData?.id ?? "",
    questionNumber: faqData?.questionNumber ?? "",
    code: faqData?.code ?? "",
    productID: faqData?.productID ?? "",
    questionDetails: {
      question: faqData?.questionDetails?.question ?? "",
      customerDetails: customerByIdObject.data,
    },
    answers: redefinedAnswersArr,
    dateAdded: faqData?.dateAdded,
    dateModified: faqData?.dateModified,
  };
};

module.exports.getAllFaqsArrWithAllDetailsUtil = async ({ allFaqsArr }) => {
  return Promise.all(
    allFaqsArr?.map(async (faqData) => {
      const faqDetailsData = await this.getSingleFaqWithAllDetailsUtil({
        faqData: faqData,
      });
      return faqDetailsData;
    })
  );
};

module.exports.getAllFaqsUtil = async ({ req }) => {
  const foundItemObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: FaqsSchema,
    schemaName: "Faqs",
    arrSortByKey: "questionNumber",
  });

  if (foundItemObj?.status === "error") {
    return foundItemObj;
  }

  const fullDetailsDataArr = await this.getAllFaqsArrWithAllDetailsUtil({
    allFaqsArr: foundItemObj?.data,
  });

  return {
    ...foundItemObj,
    data: fullDetailsDataArr,
  };
};

module.exports.getFaqByFaqIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Faq id is required.`,
      data: {},
    };
  }

  const faqID = req.body.id;
  const foundItemObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: FaqsSchema,
    schemaName: "Faq",
    dataID: faqID,
  });

  if (foundItemObj?.status === "error") {
    return foundItemObj;
  }

  const singleDataObj = await this.getSingleFaqWithAllDetailsUtil({
    faqData: foundItemObj?.data,
  });

  return {
    ...foundItemObj,
    data: singleDataObj,
  };
};

module.exports.getFaqsByProductIDUtil = async ({ req }) => {
  if (!req?.body?.productID || req.body.productID === "") {
    return {
      status: "error",
      message: `Product id is required.`,
      data: {},
    };
  }

  const productID = req.body.productID;

  const foundItemObj = await CommonApisUtility.getDataArrayByIdFromSchemaUtil({
    schema: FaqsSchema,
    schemaName: "Faqs",
    dataID: productID,
    keyname: "productID",
  });

  if (foundItemObj?.status === "error") {
    return {
      ...foundItemObj,
      message: `There are no faqs exists with product id ${productID}.`,
    };
  }

  const fullDetailsDataArr = await this.getAllFaqsArrWithAllDetailsUtil({
    allFaqsArr: foundItemObj?.data ?? [],
  });

  return {
    ...foundItemObj,
    message: `Faqs found with product id ${productID}.`,
    data: fullDetailsDataArr,
  };
};

module.exports.getNewQuestionNumberUtil = async ({ req }) => {
  const allItemsObj = await this.getAllFaqsUtil({
    req,
  });
  const dataArr = allItemsObj?.data ?? [];

  let currentMaxItemNumber = 0;

  if (dataArr && dataArr.length > 0) {
    const itemNumbersArr = [];
    dataArr.map((item) => {
      itemNumbersArr.push(item.questionNumber);
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

module.exports.addNewQuestionUtil = async ({ req }) => {
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
  if (!req?.body?.question || req.body.question === "") {
    return {
      status: "error",
      message: `Question is required.`,
      data: {},
    };
  }

  const newQuestionNumber = await this.getNewQuestionNumberUtil({
    req,
  });
  const paddedNewQuestionNumber = String(newQuestionNumber).padStart(5, "0");
  const code = `Faq${paddedNewQuestionNumber}`;
  const faqID = CommonUtility.getUniqueID();
  const productID = req.body.productID;
  const customerID = req.body.customerID;
  const question = req.body.question;
  const dateAdded = new Date();
  const dateModified = new Date();

  const foundProductObj = await ProductsUtility.getProductByProductIDUtil({
    req: {
      body: {
        id: productID,
      },
    },
  });
  if (foundProductObj?.status === "error") {
    return {
      ...foundProductObj,
      message: `Question can't be added as product with product id ${productID} does not exists.`,
      data: {},
    };
  }

  const foundCustomerObj = await CustomersUtility.getCustomerByIDUtil({
    req: {
      body: {
        id: customerID,
      },
    },
  });
  if (foundCustomerObj?.status === "error") {
    return {
      ...foundCustomerObj,
      message: `Question can't be added as customer with customer id ${customerID} does not exists.`,
      data: {},
    };
  }

  const newFaqSchema = new FaqsSchema({
    id: faqID,
    questionNumber: newQuestionNumber,
    code: code,
    productID: productID,
    questionDetails: {
      question: question,
      customerID: customerID,
    },
    answers: [],
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  const newlyAddedFaqObj = await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newFaqSchema,
    schemaName: "Faq",
  });

  if (newlyAddedFaqObj?.status === "error") {
    return newlyAddedFaqObj;
  }

  const singleDataObj = await this.getSingleFaqWithAllDetailsUtil({
    faqData: newlyAddedFaqObj?.data,
  });

  return {
    ...newlyAddedFaqObj,
    data: singleDataObj,
  };
};

module.exports.addAnswerUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Question id is required.`,
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
  if (!req?.body?.answer || req.body.answer === "") {
    return {
      status: "error",
      message: `Answer is required.`,
      data: {},
    };
  }

  const questionID = req.body.id;
  const customerID = req.body.customerID;
  const answer = req.body.answer;
  const answerID = CommonUtility.getUniqueID();

  const foundQuestionObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: FaqsSchema,
    schemaName: "Faq",
    dataID: questionID,
  });
  if (foundQuestionObj?.status === "error") {
    return foundQuestionObj;
  }

  const foundCustomerObj = await CustomersUtility.getCustomerByIDUtil({
    req: {
      body: {
        id: customerID,
      },
    },
  });
  if (foundCustomerObj?.status === "error") {
    return {
      ...foundCustomerObj,
      message: `Answer can't be added as customer with customer id ${customerID} does not exists.`,
      data: {},
    };
  }

  const alreadyAddedAnswersArr = foundQuestionObj?.data?.answers ?? [];
  alreadyAddedAnswersArr.push({
    answerID: answerID,
    answer: answer,
    customerID: customerID,
    likedBy: [],
    dislikedBy: [],
    dateAdded: new Date(),
  });

  const updatedFaqSchema = {
    id: questionID,
    answers: alreadyAddedAnswersArr,
    dateModified: new Date(),
  };

  const updatedFaqDataSet = {
    $set: updatedFaqSchema,
  };

  const updatedFaqObj = await CommonApisUtility.updateDataInSchemaUtil({
    schema: FaqsSchema,
    newDataObject: updatedFaqSchema,
    updatedDataSet: updatedFaqDataSet,
    schemaName: "Faq",
    dataID: questionID,
  });

  return {
    ...updatedFaqObj,
  };
};

module.exports.deleteQuestionUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Question id is required.`,
      data: {},
    };
  }

  const questionID = req.body.id;
  const foundQuestionObj = await this.getFaqByFaqIDUtil({ req: req });
  if (foundQuestionObj?.status === "error") {
    return foundQuestionObj;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: FaqsSchema,
    schemaName: "Faq",
    dataID: questionID,
  });
};

module.exports.deleteAnswerUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Question id is required.`,
      data: {},
    };
  }
  if (!req?.body?.answerID || req.body.answerID === "") {
    return {
      status: "error",
      message: `Answer id is required.`,
      data: {},
    };
  }

  const questionID = req.body.id;
  const answerID = req.body.answerID;
  const foundQuestionObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: FaqsSchema,
    schemaName: "Faq",
    dataID: questionID,
  });
  if (foundQuestionObj?.status === "error") {
    return foundQuestionObj;
  }

  const answersArr = foundQuestionObj?.data?.answers ?? [];
  const foundAnswerIndex = answersArr.findIndex(
    (answerData) => answerData?.answerID === answerID
  );
  if (
    foundAnswerIndex === undefined ||
    foundAnswerIndex === null ||
    foundAnswerIndex === -1
  ) {
    return {
      status: "error",
      message: `Answer with answer id ${answerID} for question with question id ${questionID} not found.`,
      data: {},
    };
  }

  answersArr.splice(foundAnswerIndex, 1);

  const newFaq = {
    id: questionID,
    answers: answersArr,
    dateModified: new Date(),
  };

  const updatedFaqSet = {
    $set: newFaq,
  };

  const updatedFaqObj = await CommonApisUtility.updateDataInSchemaUtil({
    schema: FaqsSchema,
    schemaName: "Faq",
    newDataObject: newFaq,
    updatedDataSet: updatedFaqSet,
    dataID: questionID,
  });
  if (updatedFaqObj?.status === "error") {
    return {
      ...updatedFaqObj,
      message: `Answer with answer id ${answerID} for question with question id ${questionID} not found. There is an unknow error occured.`,
    };
  }
  return {
    ...updatedFaqObj,
    message: `Answer with answer id ${answerID} for question with question id ${questionID} deleted successfully.`,
  };
};

module.exports.findAnswerInAnswersArr = async ({
  foundQuestionByIDObj,
  answerID,
}) => {
  const answersDataArr = foundQuestionByIDObj?.data?.answers ?? [];
  const foundAnswerObjIndex = answersDataArr?.findIndex(
    (answerData) => answerData?.answerID === answerID
  );
  if (
    foundAnswerObjIndex === undefined ||
    foundAnswerObjIndex === null ||
    foundAnswerObjIndex === -1
  ) {
    return {
      status: "error",
      message: `Answer with answer id ${answerID} doesn't exists.`,
      data: {},
    };
  }

  return {
    status: "success",
    message: `Answer with answer id ${answerID} exists.`,
    data: {
      foundAnswerObjIndex: foundAnswerObjIndex,
      answersDataArr: answersDataArr,
    },
  };
};

module.exports.getUpdatedLikingUtil = async ({
  answersDataArr,
  foundAnswerObjIndex,
  customerID,
}) => {
  const answerObj = answersDataArr[foundAnswerObjIndex];

  let updatedLikedByArr = answerObj?.likedBy ?? [];
  let updatedDislikedByArr = answerObj?.dislikedBy ?? [];
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
  return {
    updatedLikedByArr,
    updatedDislikedByArr,
    answersDataArr,
    answerObj,
    foundAnswerObjIndex,
  };
};

module.exports.updateLikeToFaqAnswerUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Question id is required.`,
      data: {},
    };
  }
  if (!req?.body?.answerID || req.body.answerID === "") {
    return {
      status: "error",
      message: `Answer id is required.`,
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

  const questionID = req.body.id;
  const answerID = req.body.answerID;
  const customerID = req.body.customerID;

  const foundCustomerByIDObj =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: CustomersSchema,
      schemaName: "Customer",
      dataID: customerID,
    });
  if (foundCustomerByIDObj?.status === "error") {
    return foundCustomerByIDObj;
  }

  const foundQuestionByIDObj =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: FaqsSchema,
      schemaName: "Faq",
      dataID: questionID,
    });
  if (foundQuestionByIDObj?.status === "error") {
    return foundQuestionByIDObj;
  }

  const foundAnswerObj = await this.findAnswerInAnswersArr({
    foundQuestionByIDObj,
    answerID,
  });
  if (foundAnswerObj?.status === "error") {
    return foundAnswerObj;
  }

  const {
    updatedLikedByArr,
    updatedDislikedByArr,
    answersDataArr,
    answerObj,
    foundAnswerObjIndex,
  } = await this.getUpdatedLikingUtil({
    answersDataArr: foundAnswerObj.data.answersDataArr,
    foundAnswerObjIndex: foundAnswerObj.data.foundAnswerObjIndex,
    customerID: customerID,
  });

  let newAnswerObj = {
    ...answerObj,
    likedBy: updatedLikedByArr,
    dislikedBy: updatedDislikedByArr,
  };
  let newAnswersDataArr = answersDataArr;
  newAnswersDataArr[foundAnswerObjIndex] = newAnswerObj;

  const newFaq = {
    id: questionID,
    answers: newAnswersDataArr,
  };

  const updatedFaqSet = {
    $set: newFaq,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: FaqsSchema,
    schemaName: "Faq",
    newDataObject: newFaq,
    updatedDataSet: updatedFaqSet,
    dataID: questionID,
  });
};

module.exports.getUpdatedDisLikingUtil = async ({
  answersDataArr,
  foundAnswerObjIndex,
  customerID,
}) => {
  const answerObj = answersDataArr[foundAnswerObjIndex];

  let updatedLikedByArr = answerObj?.likedBy ?? [];
  let updatedDislikedByArr = answerObj?.dislikedBy ?? [];
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
  return {
    updatedLikedByArr,
    updatedDislikedByArr,
    answersDataArr,
    answerObj,
    foundAnswerObjIndex,
  };
};

module.exports.updateDislikeToFaqAnswerUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Question id is required.`,
      data: {},
    };
  }
  if (!req?.body?.answerID || req.body.answerID === "") {
    return {
      status: "error",
      message: `Answer id is required.`,
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

  const questionID = req.body.id;
  const answerID = req.body.answerID;
  const customerID = req.body.customerID;

  const foundCustomerByIDObj =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: CustomersSchema,
      schemaName: "Customer",
      dataID: customerID,
    });
  if (foundCustomerByIDObj?.status === "error") {
    return foundCustomerByIDObj;
  }

  const foundQuestionByIDObj =
    await CommonApisUtility.getDataByIdFromSchemaUtil({
      schema: FaqsSchema,
      schemaName: "Faq",
      dataID: questionID,
    });
  if (foundQuestionByIDObj?.status === "error") {
    return foundQuestionByIDObj;
  }

  const foundAnswerObj = await this.findAnswerInAnswersArr({
    foundQuestionByIDObj,
    answerID,
  });
  if (foundAnswerObj?.status === "error") {
    return foundAnswerObj;
  }

  const {
    updatedLikedByArr,
    updatedDislikedByArr,
    answersDataArr,
    answerObj,
    foundAnswerObjIndex,
  } = await this.getUpdatedDisLikingUtil({
    answersDataArr: foundAnswerObj.data.answersDataArr,
    foundAnswerObjIndex: foundAnswerObj.data.foundAnswerObjIndex,
    customerID: customerID,
  });

  let newAnswerObj = {
    ...answerObj,
    likedBy: updatedLikedByArr,
    dislikedBy: updatedDislikedByArr,
  };
  let newAnswersDataArr = answersDataArr;
  newAnswersDataArr[foundAnswerObjIndex] = newAnswerObj;

  const newFaq = {
    id: questionID,
    answers: newAnswersDataArr,
  };

  const updatedFaqSet = {
    $set: newFaq,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: FaqsSchema,
    schemaName: "Faq",
    newDataObject: newFaq,
    updatedDataSet: updatedFaqSet,
    dataID: questionID,
  });
};
