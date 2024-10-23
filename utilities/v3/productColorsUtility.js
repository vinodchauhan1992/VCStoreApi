const ProductColorsSchema = require("../../model/v3/productColors");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");

module.exports.getAllProductColorsUtil = async ({ req }) => {
  return await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: ProductColorsSchema,
    schemaName: "Product Colors",
    arrSortByKey: "productColorNumber",
  });
};

module.exports.getProductColorByProductColorIdUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Product color id is required.`,
      data: {},
    };
  }

  const productColorID = req.body.id;
  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: ProductColorsSchema,
    schemaName: "Product Color",
    dataID: productColorID,
  });
};

module.exports.getProductColorByProductColorTitleUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: `Product color title is required.`,
      data: {},
    };
  }

  const productColorTitle = req.body.title;
  return await CommonApisUtility.getDataByTitleFromSchemaUtil({
    schema: ProductColorsSchema,
    schemaName: "Product Color",
    dataTitle: productColorTitle,
  });
};

module.exports.getProductColorByProductColorHexCodeUtil = async ({ req }) => {
  if (!req?.body?.hexCode || req.body.hexCode === "") {
    return {
      status: "error",
      message: `Product color hex code is required.`,
      data: {},
    };
  }

  const productColorHexCode = req.body.hexCode;
  return await CommonApisUtility.getDataByTitleFromSchemaUtil({
    schema: ProductColorsSchema,
    schemaName: "Product Color",
    dataID: productColorHexCode,
    keyname: "hexCode",
  });
};

module.exports.getNewProductColorNumberUtil = async ({ req }) => {
  const allProductColorsObj = await this.getAllProductColorsUtil({ req });
  const dataArr = allProductColorsObj?.data ?? [];

  let currentMaxProductColorNumber = 0;

  if (dataArr && dataArr.length > 0) {
    const productColorNumbersArr = [];
    dataArr.map((productColorData) => {
      productColorNumbersArr.push(productColorData.productColorNumber);
    });
    const maxProductColorNumber = productColorNumbersArr.reduce(function (
      prev,
      current
    ) {
      return prev && prev > current ? prev : current;
    });
    if (maxProductColorNumber) {
      currentMaxProductColorNumber = maxProductColorNumber ?? 0;
    }
  }
  const newProductColorNumber = currentMaxProductColorNumber + 1;
  return newProductColorNumber;
};

module.exports.addNewProductColorUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: `Product color title is required.`,
      data: {},
    };
  }
  if (!req?.body?.hexCode || req.body.hexCode === "") {
    return {
      status: "error",
      message: `Product color hex code is required.`,
      data: {},
    };
  }

  const productColorID = CommonUtility.getUniqueID();
  const productColorTitle = CommonUtility.capitalizeLetterOfEachWord({
    str: req.body.title,
  });
  const productColorHexCode = req.body.hexCode;
  const newProductColorNumber = await this.getNewProductColorNumberUtil({
    req,
  });
  const paddedProductColorNumber = String(newProductColorNumber).padStart(
    7,
    "0"
  );
  const productColorCode = `PC${paddedProductColorNumber}`;
  const dateAdded = new Date();
  const dateModified = new Date();

  const foundProductByTitle = await this.getProductColorByProductColorTitleUtil(
    { req: req }
  );
  if (foundProductByTitle?.status === "success") {
    return {
      status: "error",
      message: `Product color is already exists with product color title ${productColorTitle}`,
      data: {},
    };
  }

  const foundProductByHexCode =
    await this.getProductColorByProductColorHexCodeUtil({ req });
  if (foundProductByHexCode?.status === "success") {
    return {
      status: "error",
      message: `Product color is already exists with product color hex code ${productColorHexCode}`,
      data: {},
    };
  }

  const newProductColorSchema = ProductColorsSchema({
    id: productColorID,
    title: productColorTitle,
    productColorNumber: newProductColorNumber,
    code: productColorCode,
    hexCode: productColorHexCode,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newProductColorSchema,
    schemaName: "Product Color",
  });
};

module.exports.updateProductColorUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Product color id is required.`,
      data: {},
    };
  }

  const productColorID = req.body.id;
  let productColorTitle = req.body.title;
  let productColorHexCode = req.body.hexCode;
  const dateModified = new Date();

  if (
    (!productColorTitle || productColorTitle === "") &&
    (!productColorHexCode || productColorHexCode === "")
  ) {
    return {
      status: "error",
      message: `Nothing passed in body to update`,
      data: {},
    };
  }

  const foundProductColorByID = await this.getProductColorByProductColorIdUtil({
    req: req,
  });
  if (foundProductColorByID?.status === "error") {
    return foundProductColorByID;
  }

  if (productColorTitle && productColorTitle !== "") {
    const foundProductByTitle =
      await this.getProductColorByProductColorTitleUtil({ req: req });
    if (
      foundProductByTitle?.status === "success" &&
      foundProductByTitle?.data?.id !== productColorID
    ) {
      return {
        status: "error",
        message: `Product color is already exists with product color title ${productColorTitle}`,
        data: {},
      };
    }
  }

  if (productColorHexCode && productColorHexCode !== "") {
    const foundProductByHexCode =
      await this.getProductColorByProductColorHexCodeUtil({ req });
    if (
      foundProductByHexCode?.status === "success" &&
      foundProductByHexCode?.data?.id !== productColorID
    ) {
      return {
        status: "error",
        message: `Product color is already exists with product color hex code ${productColorHexCode}`,
        data: {},
      };
    }
  }

  if (!productColorTitle || productColorTitle === "") {
    productColorTitle = foundProductColorByID?.data?.title;
  }

  if (!productColorHexCode || productColorHexCode === "") {
    productColorHexCode = foundProductColorByID?.data?.hexCode;
  }

  const newProductColor = {
    id: productColorID,
    title: CommonUtility.capitalizeLetterOfEachWord({
      str: req.body.title,
    }),
    hexCode: productColorHexCode,
    dateModified: dateModified,
  };

  const updatedProductColorSet = {
    $set: newProductColor,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: ProductColorsSchema,
    newDataObject: newProductColor,
    updatedDataSet: updatedProductColorSet,
    schemaName: "Product Color",
    dataID: productColorID,
  });
};

module.exports.deleteProductColorUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Product color id is required.`,
      data: {},
    };
  }

  const productColorID = req.body.id;
  const foundProductColorByID = await this.getProductColorByProductColorIdUtil({
    req: req,
  });
  if (foundProductColorByID?.status === "error") {
    return foundProductColorByID;
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: ProductColorsSchema,
    schemaName: "Product Color",
    dataID: productColorID,
  });
};
