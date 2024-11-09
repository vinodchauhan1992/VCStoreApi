const ProductColorsSchema = require("../../model/v3/productColors");
const ProductsSchema = require("../../model/v3/products");
const CategoriesSchema = require("../../model/v3/categories");
const BrandsSchema = require("../../model/v3/brands");
const CommonApisUtility = require("./commonApisUtility");

module.exports.apiValidationForColorUtil = async ({ req }) => {
  const colorID = req.body.colorID;
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: ProductColorsSchema,
    schemaName: "Product Color",
    dataID: colorID,
  });
  return foundObj;
};

module.exports.apiValidationForCategoryUtil = async ({ req }) => {
  const categoryID = req.body.categoryID;
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CategoriesSchema,
    schemaName: "Category",
    dataID: categoryID,
  });
  return foundObj;
};

module.exports.apiValidationForBrandUtil = async ({ req }) => {
  const brandID = req.body.brandID;
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: BrandsSchema,
    schemaName: "Brand",
    dataID: brandID,
  });
  return foundObj;
};

module.exports.apiValidationForSameProductExistenceUtil = async ({ req }) => {
  const productTitle = req.body.title;
  const foundObj = await CommonApisUtility.getDataArrayByTitleFromSchemaUtil({
    schema: ProductsSchema,
    schemaName: "Products",
    dataTitle: productTitle,
  });

  if (
    foundObj?.status === "success" &&
    foundObj?.data &&
    foundObj.data.length <= 0
  ) {
    return foundObj;
  }

  const dataArr = foundObj.data;

  let isExists = false;
  dataArr?.map((dataObj) => {
    if (
      dataObj.title === req.body.title &&
      dataObj.categoryID === req.body.categoryID &&
      dataObj.brandID === req.body.brandID &&
      dataObj.colorID === req.body.colorID
    ) {
      isExists = true;
    }
  });

  return {
    status: isExists ? "error" : "success",
    message: `Product with same title ${req.body.title}, same category id ${req.body.categoryID}, same brand id ${req.body.brandID} and same color id ${req.body.colorID} already exists.`,
    data: {},
  };
};

module.exports.apiValidationUtil = async ({ req }) => {
  const validateColorObj = await this.apiValidationForColorUtil({ req });
  if (validateColorObj?.status === "error") {
    return validateColorObj;
  }

  const validateCategoryObj = await this.apiValidationForCategoryUtil({ req });
  if (validateCategoryObj?.status === "error") {
    return validateCategoryObj;
  }

  const validateBrandObj = await this.apiValidationForBrandUtil({ req });
  if (validateBrandObj?.status === "error") {
    return validateBrandObj;
  }

  const validateForSameProductExistenceUtil =
    await this.apiValidationForSameProductExistenceUtil({ req });
  if (validateForSameProductExistenceUtil?.status === "error") {
    return validateForSameProductExistenceUtil;
  }

  return {
    status: "success",
    message: "Api validation succeeded.",
    data: {},
  };
};

module.exports.validateAddNewProductUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: "Product title is required.",
      data: {},
    };
  }
  if (!req?.body?.details || req.body.details === "") {
    return {
      status: "error",
      message: "Product details is required.",
      data: {},
    };
  }
  if (!req?.body?.shortDescription || req.body.shortDescription === "") {
    return {
      status: "error",
      message: "Product short description is required.",
      data: {},
    };
  }
  if (
    !req?.body?.shippingReturnDetails ||
    req.body.shippingReturnDetails === ""
  ) {
    return {
      status: "error",
      message: "Product shipping & return details is required.",
      data: {},
    };
  }
  if (!req?.body?.highlights || req.body.highlights === "") {
    return {
      status: "error",
      message: "Product highlights is required.",
      data: {},
    };
  }
  if (!req?.body?.invoiceDescription || req.body.invoiceDescription === "") {
    return {
      status: "error",
      message: "Invoice description is required.",
      data: {},
    };
  }
  if (!req?.body?.colorID || req.body.colorID === "") {
    return {
      status: "error",
      message: "Product color id is required.",
      data: {},
    };
  }
  if (!req?.body?.categoryID || req.body.categoryID === "") {
    return {
      status: "error",
      message: "Product category id is required.",
      data: {},
    };
  }
  if (!req?.body?.brandID || req.body.brandID === "") {
    return {
      status: "error",
      message: "Product brand id is required.",
      data: {},
    };
  }
  if (!req?.body?.purchasePrice || req.body.purchasePrice === "") {
    return {
      status: "error",
      message: `Product purchase price is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.purchasePrice)) {
    return {
      status: "error",
      message: `Product purchase price must be number value.`,
      data: {},
    };
  }
  if (!req?.body?.sellingPrice || req.body.sellingPrice === "") {
    return {
      status: "error",
      message: `Product selling price is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.sellingPrice)) {
    return {
      status: "error",
      message: `Product selling price must be number value.`,
      data: {},
    };
  }
  if (isNaN(req.body.maxDiscountPercentage)) {
    return {
      status: "error",
      message: `Product max discount percentage must be number value.`,
      data: {},
    };
  }

  const foundApiValidationObj = await this.apiValidationUtil({ req });
  if (foundApiValidationObj?.status === "error") {
    return foundApiValidationObj;
  }
  return {
    status: "success",
    message: "All details passed in request are valid.",
    data: {},
  };
};
