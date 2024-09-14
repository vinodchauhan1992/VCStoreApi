const Products = require("../model/products");
const {
  uploadFileToFirebaseStorage,
  updateUploadedFileInFirebaseStorage,
  deleteUploadedFileInFirebaseStorage,
} = require("./fileManagerUtility");

module.exports.uploadProductImageToFS = async ({
  file,
  productID,
  productTitle,
}) => {
  return await uploadFileToFirebaseStorage({
    file,
    parentDocumentID: productID,
    parentDocumentName: productTitle,
    imageBasePath: `images/products`,
  });
};

module.exports.addNewProduct = async ({ productSchema, res }) => {
  return await productSchema
    .save()
    .then((respondedProduct) => {
      if (respondedProduct && Object.keys(respondedProduct).length > 0) {
        res.json({
          status: "success",
          message: `New product is added successfully.`,
          data: respondedProduct,
        });
      } else {
        res.json({
          status: "error",
          message: `Product is not added due to unknown error.`,
          data: {},
        });
      }
    })
    .catch((error) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${error.message}`,
        data: {},
      });
    });
};
