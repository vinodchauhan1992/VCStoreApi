const Categories = require("../model/categories");
const CommonUtility = require("./commonUtility");
const {
  uploadFileToFirebaseStorage,
  updateUploadedFileInFirebaseStorage,
  deleteUploadedFileInFirebaseStorage,
} = require("./fileManagerUtility");

module.exports.uploadCategoryImageToFS = async ({
  file,
  categoryID,
  categoryTitle,
}) => {
  return await uploadFileToFirebaseStorage({
    file,
    parentDocumentID: categoryID,
    parentDocumentName: categoryTitle,
    imageBasePath: `images/categories`,
  });
};

module.exports.updateUploadedCategoryImageToFS = async ({
  file,
  fullPath,
  name,
  fileFolderName,
  fileFolderPath,
  categoryID,
  categoryTitle,
}) => {
  return await updateUploadedFileInFirebaseStorage({
    file,
    fullPath,
    name,
    fileFolderName,
    fileFolderPath,
    parentDocumentID: categoryID,
    parentDocumentName: categoryTitle,
  });
};

module.exports.deleteUploadedCategoryImageToFS = async ({ fileUrl }) => {
  return await deleteUploadedFileInFirebaseStorage({
    fileUrl: fileUrl,
  });
};

module.exports.addNewCategory = async ({ categorySchema, res }) => {
  return await categorySchema
    .save()
    .then((respondedCategory) => {
      if (respondedCategory && Object.keys(respondedCategory).length > 0) {
        res.json({
          status: "success",
          message: `New category is added successfully.`,
          data: respondedCategory,
        });
      } else {
        res.json({
          status: "error",
          message: `Category is not added due to unknown error.`,
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

module.exports.updateExistingCategory = async ({
  newCategory,
  updatedCategorySet,
  categoryID,
  res,
}) => {
  return await Categories.updateOne({ id: categoryID }, updatedCategorySet)
    .then((respondedCategory) => {
      if (respondedCategory && Object.keys(respondedCategory).length > 0) {
        res.json({
          status: "success",
          message: `Category is updated successfully.`,
          data: newCategory,
        });
      } else {
        res.json({
          status: "error",
          message: `Category is not updated due to unknown error.`,
          data: {},
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: {},
      });
    });
};

module.exports.getCategoryById = async ({ categoryID }) => {
  return await Categories.findOne({
    id: categoryID,
  })
    .select(["-_id"])
    .then((category) => {
      if (category && Object.keys(category).length > 0) {
        return {
          status: "success",
          message: `Category with categoryID ${categoryID} fetched successfully.`,
          data: CommonUtility.sortObject(category),
        };
      } else {
        return {
          status: "error",
          message: `There is no category exists with categoryID ${categoryID}.`,
          data: {},
        };
      }
    })
    .catch((err) => {
      return {
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: {},
      };
    });
};
