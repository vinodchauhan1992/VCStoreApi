const Categories = require("../../model/categories");
const CommonUtility = require("../../utilities/commonUtility");
const CategoryUtility = require("../../utilities/categoryUtility");

var dataObject = { status: "success", message: "", data: [] };

module.exports.getAllProductCategories = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Categories.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((categories) => {
      if (categories && categories.length > 0) {
        dataObject.status = "success";
        dataObject.message = "Categories fetched successfully.";
        dataObject.data = categories;
      } else {
        dataObject.status = "success";
        dataObject.message =
          "Categories fetched successfully. But categories doesn't have any data.";
        dataObject.data = [];
      }
      res.json(dataObject);
    })
    .catch((err) => {
      dataObject.message = `There is an error occurred. ${err}`;
      dataObject.status = "error";
      res.json(dataObject);
    });
};

module.exports.getProductCategory = (req, res) => {
  if (!req?.params?.categoryID || req.params.categoryID === "") {
    dataObject.status = "error";
    dataObject.message = "Category id should be provided";
    res.json(dataObject);
  } else {
    const categoryID = req.params.categoryID;

    Categories.findOne({
      id: categoryID,
    })
      .select(["-_id"])
      .then((category) => {
        console.log("category", category);
        if (category && Object.keys(category).length > 0) {
          dataObject.status = "success";
          dataObject.message = `Category with categoryID ${categoryID} fetched successfully.`;
          dataObject.data = category;
        } else {
          dataObject.status = "error";
          dataObject.message = `There is no category exists with categoryID ${categoryID}.`;
          dataObject.data = {};
        }
        res.json(dataObject);
      })
      .catch((err) => {
        dataObject.status = "error";
        dataObject.message = `There is an error occurred. ${err}`;
        dataObject.data = {};
        res.json(dataObject);
      });
  }
};

module.exports.addProductCategory = async (req, res) => {
  if (!req?.body?.title || req.body.title === "") {
    dataObject.status = "error";
    dataObject.message = "Category title is required.";
    res.json(dataObject);
    return;
  }
  if (!req?.body?.description || req.body.description === "") {
    dataObject.status = "error";
    dataObject.message = "Category description is required.";
    res.json(dataObject);
    return;
  }

  const categoryID = CommonUtility.getUniqueID(req.body.title);
  const categoryTitle = req.body.title;

  let uploadResponse = null;
  let uploadedFileStatus = "no file added";
  let uploadedFileMessage = "";
  let uploadedFileData = {};
  if (req.file) {
    uploadResponse = await CategoryUtility.uploadCategoryImageToFS({
      file: req.file,
      categoryID: categoryID,
      categoryTitle: categoryTitle,
    });

    uploadedFileStatus = uploadResponse?.isSucceeded ? "success" : "error";
    uploadedFileMessage = uploadResponse?.message;
    uploadedFileData = uploadResponse?.fileData;
  }

  const category = new Categories({
    id: categoryID,
    title: categoryTitle,
    code: categoryTitle.toLowerCase(),
    description: req.body.description,
    imageData: uploadedFileData,
    dateAdded: new Date(),
    dateModified: new Date(),
  });

  if (req.file) {
    if (uploadResponse.isSucceeded) {
      CategoryUtility.addNewCategory({
        categorySchema: category,
        res: res,
      });
    } else {
      dataObject.status = uploadedFileStatus;
      dataObject.message = uploadedFileMessage;
      dataObject.data = uploadedFileData;
      res.json(dataObject);
    }
  } else {
    CategoryUtility.addNewCategory({
      categorySchema: category,
      res: res,
    });
  }
};

module.exports.deleteProductCategory = async (req, res) => {
  if (req.params.categoryID == null) {
    dataObject.status = "error";
    dataObject.message = "Category id must be provided to delete a category.";
    dataObject.data = {};
    res.json(dataObject);
  } else {
    const categoryID = req.params.categoryID;

    Categories.findOne({
      id: categoryID,
    })
      .select(["-_id"])
      .then((category) => {
        if (category && Object.keys(category).length > 0) {
          Categories.deleteOne({
            id: categoryID,
          })
            .select(["-_id"])
            .then(async (result) => {
              if (result && result.deletedCount === 1) {
                const deleteFileResp =
                  await CategoryUtility.deleteUploadedCategoryImageToFS({
                    fileUrl: category?.imageData?.imageUrl,
                  });
                let msg = `Category with category id ${categoryID} is deleted successfully with category image.`;
                if (!deleteFileResp.isSucceeded) {
                  msg = `Category with category id ${categoryID} is deleted successfully but category image is not deleted. FileDeletionError: ${deleteFileResp?.message}`;
                }
                dataObject.status = "success";
                dataObject.message = msg;
                dataObject.data = {};
                res.json(dataObject);
              } else {
                dataObject.status = "error";
                dataObject.message = `Category with category id ${categoryID} is not deleted.`;
                dataObject.data = {};
                res.json(dataObject);
              }
            })
            .catch((err) => {
              dataObject.status = "error";
              dataObject.message = `There is an error occurred. ${err}`;
              dataObject.data = {};
              res.json(dataObject);
            });
        } else {
          dataObject.status = "error";
          dataObject.message = `There is no category exists with categoryID ${categoryID}.`;
          dataObject.data = {};
          res.json(dataObject);
        }
      })
      .catch((err) => {
        dataObject.status = "error";
        dataObject.message = `There is an error occurred. ${err}`;
        dataObject.data = {};
        res.json(dataObject);
      });
  }
};

module.exports.updateProductCategory = async (req, res) => {
  if (typeof req.body == undefined) {
    dataObject.status = "error";
    dataObject.message = "Send all required data to update a category.";
    dataObject.data = {};
    res.json(dataObject);
    return;
  }
  if (!req?.params?.categoryID || req.params.categoryID === "") {
    dataObject.status = "error";
    dataObject.message = "Send category id in url.";
    dataObject.data = {};
    res.json(dataObject);
    return;
  }
  if (!req?.body?.id || req.body.id === "") {
    dataObject.status = "error";
    dataObject.message = "Send id in body.";
    dataObject.data = {};
    res.json(dataObject);
    return;
  }
  if (!req?.body?.title || req.body.title === "") {
    dataObject.status = "error";
    dataObject.message = "Send title in body.";
    dataObject.data = {};
    res.json(dataObject);
    return;
  }
  if (!req?.body?.description || req.body.description === "") {
    dataObject.status = "error";
    dataObject.message = "Send description in body.";
    dataObject.data = {};
    res.json(dataObject);
    return;
  }

  const categoryID = req.body.id;
  const categoryTitle = req.body.title;
  let finalImageData = null;
  if (req?.body?.imageData && req.body.imageData !== "") {
    const localImgData = JSON.parse(JSON.parse(req.body.imageData));
    if (localImgData && Object.keys(localImgData).length > 1) {
      finalImageData = localImgData;
    }
  }
  Categories.findOne({
    id: categoryID,
  })
    .select(["-_id"])
    .then(async (currentCategory) => {
      if (currentCategory && Object.keys(currentCategory).length > 0) {
        let updatedUploadedResponse = null;
        let updatedUploadedFileStatus = "no file added";
        let updatedUploadedFileMessage = "";
        let updatedUploadedFileData = null;
        if (req.file) {
          if (
            finalImageData &&
            Object.keys(finalImageData).length > 1 &&
            finalImageData?.fullPath &&
            finalImageData.fullPath !== "" &&
            finalImageData?.imageUrl &&
            finalImageData.imageUrl !== "" &&
            finalImageData?.name &&
            finalImageData.name !== "" &&
            finalImageData?.fileFolderName &&
            finalImageData.fileFolderName !== "" &&
            finalImageData?.fileFolderPath &&
            finalImageData.fileFolderPath !== ""
          ) {
            console.log("update_existing");
            // updated existing image
            updatedUploadedResponse =
              await CategoryUtility.updateUploadedCategoryImageToFS({
                file: req.file,
                categoryID: categoryID,
                categoryTitle: categoryTitle,
                fullPath: finalImageData.fullPath,
                name: finalImageData.name,
                fileFolderName: finalImageData.fileFolderName,
                fileFolderPath: finalImageData.fileFolderPath,
              });
          } else {
            console.log("add_new");
            // add new image
            updatedUploadedResponse =
              await CategoryUtility.uploadCategoryImageToFS({
                file: req.file,
                categoryID: categoryID,
                categoryTitle: categoryTitle,
              });
          }
          updatedUploadedFileStatus = updatedUploadedResponse?.isSucceeded
            ? "success"
            : "error";
          updatedUploadedFileMessage = updatedUploadedResponse?.message;
          updatedUploadedFileData = updatedUploadedResponse?.fileData;
        }
        const newCategory = {
          id: categoryID,
          title: categoryTitle,
          code: categoryTitle.toLowerCase(),
          description: req.body.description,
          imageData: updatedUploadedFileData
            ? updatedUploadedFileData
            : finalImageData,
          dateAdded: req.body.dateAdded,
          dateModified: new Date(),
        };

        const updatedCategorySet = {
          $set: newCategory,
        };

        if (req.file) {
          if (updatedUploadedResponse.isSucceeded) {
            CategoryUtility.updateExistingCategory({
              newCategory: newCategory,
              updatedCategorySet: updatedCategorySet,
              categoryID: categoryID,
              res: res,
            });
          } else {
            dataObject.status = updatedUploadedFileStatus;
            dataObject.message = updatedUploadedFileMessage;
            dataObject.data = updatedUploadedFileData;
            res.json(dataObject);
          }
        } else {
          CategoryUtility.updateExistingCategory({
            newCategory: newCategory,
            updatedCategorySet: updatedCategorySet,
            categoryID: categoryID,
            res: res,
          });
        }
      } else {
        dataObject.status = "error";
        dataObject.message = `There is no category exists with categoryID ${categoryID}.`;
        dataObject.data = {};
        res.json(dataObject);
        return;
      }
    })
    .catch((err) => {
      dataObject.status = "error";
      dataObject.message = `There is an error occurred. ${err}`;
      dataObject.data = {};
      res.json(dataObject);
      return;
    });
};
