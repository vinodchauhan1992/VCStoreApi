const ProductsSchema = require("../../model/v3/products");
const WishlistsSchema = require("../../model/v3/wishlists");
const CategoriesSchema = require("../../model/v3/categories");
const StocksSchema = require("../../model/v3/stocks");
const BrandsSchema = require("../../model/v3/brands");
const ProductColorsSchema = require("../../model/v3/productColors");
const CommonApisUtility = require("./commonApisUtility");
const CommonUtility = require("./commonUtility");
const ProductsValidationsUtility = require("./productsValidationsUtility");
const StocksUtility = require("./stocksUtility");
const RatingsUtility = require("./ratingsUtility");
const {
  uploadFileToFirebaseStorage,
  deleteUploadedFileInFirebaseStorage,
  updateUploadedFileInFirebaseStorage,
} = require("./fileManagerUtility");

const imageBasePath = `images/products`;

module.exports.getProductCategoryByIDUtil = async ({ categoryID }) => {
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CategoriesSchema,
    schemaName: "Category",
    dataID: categoryID,
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
    data: { id: categoryID },
  };
};

module.exports.getProductBrandByIDUtil = async ({ brandID }) => {
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: BrandsSchema,
    schemaName: "Brand",
    dataID: brandID,
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
    data: { id: brandID },
  };
};

module.exports.getProductColorByIDUtil = async ({ colorID }) => {
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: ProductColorsSchema,
    schemaName: "Product Color",
    dataID: colorID,
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
    data: { id: colorID },
  };
};

module.exports.getProductStockByProductIDUtil = async ({ productID }) => {
  const foundObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: StocksSchema,
    schemaName: "Stock",
    dataID: productID,
    keyname: "productID",
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
    data: { id: stockID },
  };
};

module.exports.getRatingsByProductIDUtil = async ({ productID }) => {
  const foundObj = await RatingsUtility.getRatingsByProductIDUtil({
    req: {
      body: {
        productID: productID,
      },
    },
  });

  if (
    foundObj?.status === "success" &&
    foundObj?.data &&
    foundObj.data.length > 0
  ) {
    return foundObj;
  }

  return {
    ...foundObj,
    data: [],
  };
};

module.exports.getAverageRatingFromRatingsReviewsArrUtil = async ({
  ratingsReviewsArr,
}) => {
  let maxRating = 5;
  let rating = 0;
  ratingsReviewsArr.map((ratingsReviewData) => {
    const reviewRatings = ratingsReviewData.ratings;
    if (reviewRatings.maxRating > maxRating) {
      maxRating = reviewRatings.maxRating;
    }
    rating = rating + reviewRatings.rating;
  });
  const averageRating = rating / ratingsReviewsArr.length;
  return { maxRating: maxRating, averageRating: averageRating };
};

module.exports.getWishlistsByProductIDUtil = async ({ productID }) => {
  const foundObj = await CommonApisUtility.getDataArrayByIdFromSchemaUtil({
    schema: WishlistsSchema,
    schemaName: "Wishlists",
    dataID: productID,
    keyname: "productID",
  });

  if (
    foundObj?.status === "success" &&
    foundObj?.data &&
    foundObj.data.length > 0
  ) {
    return foundObj;
  }

  return {
    ...foundObj,
    data: [],
  };
};

module.exports.getSingleProductWithAllDetailsUtil = async ({ productData }) => {
  const categoryByIdObject = await this.getProductCategoryByIDUtil({
    categoryID: productData?.categoryID,
  });
  const brandByIdObject = await this.getProductBrandByIDUtil({
    brandID: productData?.brandID,
  });
  const productColorByIdObject = await this.getProductColorByIDUtil({
    colorID: productData?.colorID,
  });
  const stockByProductIdObject = await this.getProductStockByProductIDUtil({
    productID: productData?.id,
  });
  const ratingsReviewsByProductIdObject = await this.getRatingsByProductIDUtil({
    productID: productData?.id,
  });
  const averageRatingsObj =
    await this.getAverageRatingFromRatingsReviewsArrUtil({
      ratingsReviewsArr: ratingsReviewsByProductIdObject?.data ?? [],
    });
  const wishlistsByProductIdObject = await this.getWishlistsByProductIDUtil({
    productID: productData?.id,
  });
  return {
    id: productData?.id ?? "",
    productNumber: productData?.productNumber ?? 1,
    sku: productData?.sku ?? "",
    title: productData?.title ?? "",
    description: {
      details: productData?.description?.details ?? "",
      shortDescription: productData?.description?.shortDescription ?? "",
      shippingReturnDetails:
        productData?.description?.shippingReturnDetails ?? "",
      highlights: productData?.description?.highlights ?? "",
      invoiceDescription: productData?.description?.invoiceDescription ?? "",
    },
    colorDetails: productColorByIdObject.data,
    categoryDetails: categoryByIdObject.data,
    brandDetails: brandByIdObject.data,
    ratingsReviewsDetails: ratingsReviewsByProductIdObject.data,
    questionsAnswersDetails: [],
    wishlistsDetails: wishlistsByProductIdObject.data,
    stockDetails: stockByProductIdObject.data,
    averageRating: {
      maxRating: averageRatingsObj.maxRating,
      rating: averageRatingsObj.averageRating,
    },
    priceDetails: {
      purchasePrice: productData?.priceDetails?.purchasePrice ?? 0,
      sellingPrice: productData?.priceDetails?.sellingPrice ?? 0,
      profitMargin: productData?.priceDetails?.profitMargin ?? 0,
      maxDiscountPercentage:
        productData?.priceDetails?.maxDiscountPercentage ?? 0,
      maxDiscountValue: productData?.priceDetails?.maxDiscountValue ?? 0,
      profitAfterMaxDiscount:
        productData?.priceDetails?.profitAfterMaxDiscount ?? 0,
      discountedPrice: productData?.priceDetails?.discountedPrice ?? 0,
      isProfit: productData?.priceDetails?.isProfit ?? false,
    },
    isFreeShipping: productData?.isFreeShipping ?? false,
    imageData: productData?.imageData,
    dateAdded: productData?.dateAdded ?? new Date(),
    dateModified: productData?.dateModified ?? new Date(),
  };
};

module.exports.getAllProductsArrWithAllDetailsUtil = async ({
  allProductsArr,
}) => {
  return Promise.all(
    allProductsArr?.map(async (productData) => {
      const productDetailsData = await this.getSingleProductWithAllDetailsUtil({
        productData: productData,
      });
      return productDetailsData;
    })
  );
};

module.exports.getAllProductsUtil = async ({ req }) => {
  const foundAllProductsObj = await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: ProductsSchema,
    schemaName: "Products",
    arrSortByKey: "productNumber",
  });

  if (
    foundAllProductsObj?.status === "error" &&
    foundAllProductsObj?.data?.length <= 0
  ) {
    return foundAllProductsObj;
  }

  const fullDetailsProductsArr = await this.getAllProductsArrWithAllDetailsUtil(
    { allProductsArr: foundAllProductsObj?.data }
  );

  return {
    ...foundAllProductsObj,
    data: fullDetailsProductsArr,
  };
};

module.exports.getProductByProductIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Product id is required.`,
      data: {},
    };
  }

  const productID = req.body.id;
  const foundProductObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: ProductsSchema,
    schemaName: "Product",
    dataID: productID,
  });

  if (
    foundProductObj?.status === "error" &&
    Object.keys(foundProductObj?.data) <= 0
  ) {
    return foundProductObj;
  }

  const fullDetailsProduct = await this.getSingleProductWithAllDetailsUtil({
    productData: foundProductObj?.data,
  });

  return {
    ...foundProductObj,
    data: fullDetailsProduct,
  };
};

module.exports.getProductsByProductTitleUtil = async ({ req }) => {
  if (!req?.body?.title || req.body.title === "") {
    return {
      status: "error",
      message: `Product title is required.`,
      data: [],
    };
  }

  const productTitle = req.body.title;
  const foundProductsObj =
    await CommonApisUtility.getDataArrayByTitleFromSchemaUtil({
      schema: ProductsSchema,
      schemaName: "Products",
      dataTitle: productTitle,
    });

  if (
    foundProductsObj?.status === "error" &&
    foundProductsObj?.data?.length <= 0
  ) {
    return foundProductsObj;
  }

  const fullDetailsProductsArr = await this.getAllProductsArrWithAllDetailsUtil(
    {
      allProductsArr: foundProductsObj?.data ?? [],
    }
  );

  return {
    ...foundProductsObj,
    data: fullDetailsProductsArr,
  };
};

module.exports.getProductsByCategoryIDUtil = async ({ req }) => {
  if (!req?.body?.categoryID || req.body.categoryID === "") {
    return {
      status: "error",
      message: `Category id is required.`,
      data: {},
    };
  }

  const categoryID = req.body.categoryID;
  const foundProductsObj =
    await CommonApisUtility.getDataArrayByIdFromSchemaUtil({
      schema: ProductsSchema,
      schemaName: "Products",
      dataID: categoryID,
      keyname: "categoryID",
    });

  if (
    foundProductsObj?.status === "error" &&
    foundProductsObj?.data?.length <= 0
  ) {
    return {
      ...foundProductsObj,
      message: `Products not found with category id ${categoryID}.`,
    };
  }

  const fullDetailsProductsArr = await this.getAllProductsArrWithAllDetailsUtil(
    {
      allProductsArr: foundProductsObj?.data,
    }
  );

  return {
    ...foundProductsObj,
    data: fullDetailsProductsArr,
  };
};

module.exports.uploadProductImageToFS = async ({ file, productID, sku }) => {
  return await uploadFileToFirebaseStorage({
    file,
    parentDocumentID: productID,
    parentDocumentName: sku,
    imageBasePath: imageBasePath,
  });
};

module.exports.getNewProductNumberUtil = async ({ req }) => {
  const allProductsObj = await this.getAllProductsUtil({ req });
  const dataArr = allProductsObj?.data ?? [];

  let currentMaxProductNumber = 0;

  if (dataArr && dataArr.length > 0) {
    const productNumbersArr = [];
    dataArr.map((productData) => {
      productNumbersArr.push(productData.productNumber);
    });
    const maxProductNumber = productNumbersArr.reduce(function (prev, current) {
      return prev && prev > current ? prev : current;
    });
    if (maxProductNumber) {
      currentMaxProductNumber = maxProductNumber ?? 0;
    }
  }
  const newProductNumber = currentMaxProductNumber + 1;
  return newProductNumber;
};

module.exports.addProductDataUtil = async ({ newProductSchema }) => {
  const newlyAddedDataObj = await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newProductSchema,
    schemaName: "Product",
  });
  if (newlyAddedDataObj?.status === "error") {
    return newlyAddedDataObj;
  }

  const productID = newlyAddedDataObj?.data?.id;

  if (productID && productID !== "") {
    await StocksUtility.addNewProductStockUtil({
      req: {
        body: {
          productID: productID,
          quantityAvailable: 0,
        },
      },
    });
  }

  const fullDetailsData = await this.getSingleProductWithAllDetailsUtil({
    productData: newlyAddedDataObj?.data,
  });
  return {
    ...newlyAddedDataObj,
    data: fullDetailsData,
  };
};

module.exports.addNewProductUtil = async ({ req }) => {
  const validationObj =
    await ProductsValidationsUtility.validateAddNewProductUtil({ req });
  if (validationObj?.status === "error") {
    return validationObj;
  }

  const newProductNumber = await this.getNewProductNumberUtil({ req });

  const productID = CommonUtility.getUniqueID();
  const paddedNewProductNumber = String(newProductNumber).padStart(9, "0");
  const productCode = `Prod${paddedNewProductNumber}`;
  const newMaxDiscountPercentage = req?.body?.maxDiscountPercentage ?? 0;

  const purchasePrice = CommonUtility.amountRoundingFunc({
    value: req.body.purchasePrice,
  });
  const sellingPrice = CommonUtility.amountRoundingFunc({
    value: req.body.sellingPrice,
  });
  const profitMargin = CommonUtility.amountRoundingFunc({
    value: sellingPrice - purchasePrice,
  });
  const maxDiscountPercentage = CommonUtility.amountRoundingFunc({
    value: newMaxDiscountPercentage,
  });
  const maxDiscountValue = CommonUtility.amountRoundingFunc({
    value: (sellingPrice * maxDiscountPercentage) / 100,
  });
  const discountedPrice = CommonUtility.amountRoundingFunc({
    value: sellingPrice - maxDiscountValue,
  });
  const profitAfterMaxDiscount = CommonUtility.amountRoundingFunc({
    value: sellingPrice - maxDiscountValue - purchasePrice,
  });
  let isProfit = true;
  if (profitAfterMaxDiscount <= 0) {
    isProfit = false;
  }
  const isFreeShipping = req?.body?.isFreeShipping ?? false;

  let uploadResponse = null;
  let uploadedFileStatus = "no file added";
  let uploadedFileMessage = "";
  let uploadedFileData = {};
  if (req.file) {
    uploadResponse = await this.uploadProductImageToFS({
      file: req.file,
      productID: productID,
      sku: productCode,
    });

    uploadedFileStatus = uploadResponse?.isSucceeded ? "success" : "error";
    uploadedFileMessage = uploadResponse?.message;
    uploadedFileData = uploadResponse?.fileData;
  }

  const newProductSchema = new ProductsSchema({
    id: productID,
    productNumber: newProductNumber,
    sku: productCode,
    title: req.body.title,
    description: {
      details: req.body.details,
      shortDescription: req.body.shortDescription,
      shippingReturnDetails: req.body.shippingReturnDetails,
      highlights: req.body.highlights,
      invoiceDescription: req.body.invoiceDescription,
    },
    colorID: req.body.colorID,
    categoryID: req.body.categoryID,
    brandID: req.body.brandID,
    priceDetails: {
      purchasePrice: purchasePrice,
      sellingPrice: sellingPrice,
      profitMargin: profitMargin,
      maxDiscountPercentage: maxDiscountPercentage,
      maxDiscountValue: maxDiscountValue,
      profitAfterMaxDiscount: profitAfterMaxDiscount,
      discountedPrice: discountedPrice,
      isProfit: isProfit,
    },
    isFreeShipping: isFreeShipping,
    imageData: uploadedFileData,
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  if (req.file) {
    if (uploadResponse.isSucceeded) {
      return await this.addProductDataUtil({
        newProductSchema: newProductSchema,
      });
    }
    return {
      status: uploadedFileStatus,
      message: uploadedFileMessage,
      data: uploadedFileData,
    };
  }
  return await this.addProductDataUtil({
    newProductSchema: newProductSchema,
  });
};

module.exports.deleteUploadedProductImageToFS = async ({ fileUrl }) => {
  return await deleteUploadedFileInFirebaseStorage({
    fileUrl: fileUrl,
  });
};

module.exports.deleteProductUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Product id is required.`,
      data: {},
    };
  }

  const productID = req.body.id;

  const foundProductByIDObj = await this.getProductByProductIDUtil({ req });
  if (foundProductByIDObj?.status === "error") {
    return foundProductByIDObj;
  }

  const imageUrl = foundProductByIDObj?.data?.imageData?.imageUrl ?? null;

  let imageDeletionResponseObj = {
    status: "success",
    message: "",
    data: {},
  };

  if (imageUrl && imageUrl !== "") {
    const deleteFileResp = await this.deleteUploadedProductImageToFS({
      fileUrl: imageUrl,
    });
    let msg = `Product image for product id ${productID} is deleted successfully.`;
    if (!deleteFileResp.isSucceeded) {
      msg = `Product image for product id ${productID} is not deleted. FileDeletionError: ${deleteFileResp?.message}`;
    }
    imageDeletionResponseObj = {
      status: "success",
      message: msg,
      data: {},
    };
  }

  const deleteApiResponseObj =
    await CommonApisUtility.deleteDataByIdFromSchemaUtil({
      schema: ProductsSchema,
      schemaName: "Product",
      dataID: productID,
    });

  const stockID = foundProductByIDObj?.data?.stockDetails?.id;

  if (stockID && stockID !== "") {
    await StocksUtility.deleteProductStockUtil({
      req: {
        body: {
          id: stockID,
        },
      },
    });
  }

  return {
    ...deleteApiResponseObj,
    message:
      imageDeletionResponseObj?.message &&
      imageDeletionResponseObj.message !== ""
        ? `${deleteApiResponseObj?.message} and ${imageDeletionResponseObj.message}`
        : deleteApiResponseObj?.message,
  };
};

module.exports.updateUploadedProductImageToFS = async ({
  file,
  productID,
  sku,
  fullPath,
  name,
  fileFolderName,
  fileFolderPath,
}) => {
  return await updateUploadedFileInFirebaseStorage({
    file: file,
    fullPath: fullPath,
    name: name,
    fileFolderName: fileFolderName,
    fileFolderPath: fileFolderPath,
    parentDocumentID: productID,
    parentDocumentName: sku,
  });
};

module.exports.updateProductImageInFSUtil = async ({
  productID,
  sku,
  imageData,
  file,
}) => {
  let finalImageData = null;
  if (
    imageData &&
    Object.keys(imageData).length > 0 &&
    imageData?.imageUrl &&
    imageData.imageUrl !== ""
  ) {
    finalImageData = imageData;
  }

  let updatedUploadedResponse = null;
  if (finalImageData) {
    // updated existing image
    updatedUploadedResponse = await this.updateUploadedProductImageToFS({
      file: file,
      productID: productID,
      sku: sku,
      fullPath: finalImageData?.fullPath,
      name: finalImageData?.name,
      fileFolderName: finalImageData?.fileFolderName,
      fileFolderPath: finalImageData?.fileFolderPath,
    });
  } else {
    // add new image
    updatedUploadedResponse = await this.uploadProductImageToFS({
      file: file,
      productID: productID,
      sku: sku,
    });
  }

  return {
    status: updatedUploadedResponse?.isSucceeded ? "success" : "error",
    message: updatedUploadedResponse?.isSucceeded
      ? `Product photo is updated succefully for product id ${productID} and sku ${sku}. Error: ${updatedUploadedResponse?.message}`
      : `There is an error occurred. Product photo cannot be updated for product id ${productID} and sku ${sku}. Error: ${updatedUploadedResponse?.message}`,
    data: updatedUploadedResponse?.fileData ?? null,
  };
};

module.exports.updateDataInProductTableUtil = async ({
  newDataObject,
  updatedDataSet,
  productID,
}) => {
  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: ProductsSchema,
    newDataObject: newDataObject,
    updatedDataSet: updatedDataSet,
    schemaName: "Product",
    dataID: productID,
  });
};

module.exports.getProductDataByIdFromTableUtil = async ({ productID }) => {
  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: ProductsSchema,
    schemaName: "Product",
    dataID: productID,
  });
};

module.exports.updateProductPhotoUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Product id is required.`,
      data: {},
    };
  }
  if (!req?.file) {
    return {
      status: "error",
      message: "Image is required.",
      data: {},
    };
  }

  const productID = req.body.id;
  const foundDataByIdObj = await this.getProductDataByIdFromTableUtil({
    productID: productID,
  });
  if (foundDataByIdObj?.status === "error") {
    return foundDataByIdObj;
  }
  if (
    !foundDataByIdObj?.data ||
    Object.keys(foundDataByIdObj.data).length <= 0
  ) {
    return {
      status: "error",
      message: "Product not found.",
      data: {},
    };
  }
  const sku = foundDataByIdObj.data.sku;
  const imageData = foundDataByIdObj?.data?.imageData ?? null;
  const file = req.file;

  const updatedPhotoObj = await this.updateProductImageInFSUtil({
    productID: productID,
    sku: sku,
    imageData: imageData,
    file: file,
  });

  if (updatedPhotoObj?.status === "error") {
    return updatedPhotoObj;
  }

  const newProductPhoto = {
    id: productID,
    imageData: updatedPhotoObj.data,
    dateModified: new Date(),
  };

  const updatedProductPhotoSet = {
    $set: newProductPhoto,
  };

  return await this.updateDataInProductTableUtil({
    newDataObject: newProductPhoto,
    updatedDataSet: updatedProductPhotoSet,
    productID: productID,
  });
};

module.exports.updateProductDescriptionDetailsUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Product id is required.`,
      data: {},
    };
  }

  const productID = req.body.id;
  let productDetails = req.body.details;
  let productShortDescription = req.body.shortDescription;
  let productShippingReturnDetails = req.body.shippingReturnDetails;
  let productHighlights = req.body.highlights;
  let invoiceDescription = req.body.invoiceDescription;
  const dateModified = new Date();

  if (
    (!productDetails || productDetails === "") &&
    (!productShortDescription || productShortDescription === "") &&
    (!productShippingReturnDetails || productShippingReturnDetails === "") &&
    (!productHighlights || productHighlights === "") &&
    (!invoiceDescription || invoiceDescription === "")
  ) {
    return {
      status: "error",
      message: `Product not updated with product id ${productID}. Nothing new passed in body to update`,
      data: {},
    };
  }

  const foundProductByIDObj = await this.getProductByProductIDUtil({
    req: req,
  });
  if (foundProductByIDObj?.status === "error") {
    return foundProductByIDObj;
  }

  if (!productDetails || productDetails === "") {
    productDetails = foundProductByIDObj?.data?.description?.details;
  }

  if (!productShortDescription || productShortDescription === "") {
    productShortDescription =
      foundProductByIDObj?.data?.description?.shortDescription;
  }

  if (!productShippingReturnDetails || productShippingReturnDetails === "") {
    productShippingReturnDetails =
      foundProductByIDObj?.data?.description?.shippingReturnDetails;
  }

  if (!productHighlights || productHighlights === "") {
    productHighlights = foundProductByIDObj?.data?.description?.highlights;
  }

  if (!invoiceDescription || invoiceDescription === "") {
    invoiceDescription =
      foundProductByIDObj?.data?.description?.invoiceDescription;
  }

  const newProduct = {
    id: productID,
    description: {
      details: productDetails,
      shortDescription: productShortDescription,
      shippingReturnDetails: productShippingReturnDetails,
      highlights: productHighlights,
      invoiceDescription: invoiceDescription,
    },
    dateModified: dateModified,
  };

  const updatedProductSet = {
    $set: newProduct,
  };

  return await this.updateDataInProductTableUtil({
    newDataObject: newProduct,
    updatedDataSet: updatedProductSet,
    productID: productID,
  });
};

module.exports.updateProductPriceDetailsUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Product id is required.`,
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

  const productID = req.body.id;

  const foundProductByIDObj = await this.getProductByProductIDUtil({
    req: req,
  });
  if (foundProductByIDObj?.status === "error") {
    return foundProductByIDObj;
  }

  let newMaxDiscountPercentage =
    foundProductByIDObj?.data?.priceDetails?.maxDiscountPercentage;
  if (req?.body?.maxDiscountPercentage && req.body.maxDiscountPercentage > 0) {
    newMaxDiscountPercentage = req.body.maxDiscountPercentage;
  }
  const purchasePrice = CommonUtility.amountRoundingFunc({
    value: req.body.purchasePrice,
  });
  const sellingPrice = CommonUtility.amountRoundingFunc({
    value: req.body.sellingPrice,
  });
  const profitMargin = CommonUtility.amountRoundingFunc({
    value: sellingPrice - purchasePrice,
  });
  const maxDiscountPercentage = CommonUtility.amountRoundingFunc({
    value: newMaxDiscountPercentage,
  });
  const maxDiscountValue = CommonUtility.amountRoundingFunc({
    value: (sellingPrice * maxDiscountPercentage) / 100,
  });
  const discountedPrice = CommonUtility.amountRoundingFunc({
    value: sellingPrice - maxDiscountValue,
  });
  const profitAfterMaxDiscount = CommonUtility.amountRoundingFunc({
    value: sellingPrice - maxDiscountValue - purchasePrice,
  });
  let isProfit = true;
  if (profitAfterMaxDiscount <= 0) {
    isProfit = false;
  }
  const dateModified = new Date();
  const isFreeShipping = req?.body?.isFreeShipping ?? false;

  const newProduct = {
    id: productID,
    priceDetails: {
      purchasePrice: purchasePrice,
      sellingPrice: sellingPrice,
      profitMargin: profitMargin,
      maxDiscountPercentage: maxDiscountPercentage,
      maxDiscountValue: maxDiscountValue,
      profitAfterMaxDiscount: profitAfterMaxDiscount,
      discountedPrice: discountedPrice,
      isProfit: isProfit,
    },
    isFreeShipping: isFreeShipping,
    dateModified: dateModified,
  };

  const updatedProductSet = {
    $set: newProduct,
  };

  return await this.updateDataInProductTableUtil({
    newDataObject: newProduct,
    updatedDataSet: updatedProductSet,
    productID: productID,
  });
};
