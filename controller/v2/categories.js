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
        res.json({
          status: "success",
          message: "Categories fetched successfully.",
          data: CommonUtility.sortObjectsOfArray(categories),
        });
      } else {
        res.json({
          status: "success",
          message:
            "Categories fetched successfully. But categories doesn't have any data.",
          data: [],
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: `There is an error occurred. ${err}`,
        data: [],
      });
    });
};

module.exports.getProductCategory = async (req, res) => {
  if (!req?.params?.categoryID || req.params.categoryID === "") {
    dataObject.status = "error";
    dataObject.message = "Category id should be provided";
    res.json(dataObject);
  } else {
    const categoryID = req.params.categoryID;

    const foundCategoryResponse = await CategoryUtility.getCategoryById({
      categoryID,
    });
    res.json(foundCategoryResponse);
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

  const categoryID = CommonUtility.getUniqueID();
  const categoryTitle = req.body.title;
  const isActive = req?.body?.isActive ?? false;

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
    isActive: isActive,
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
                if (
                  category?.imageData?.imageUrl &&
                  category.imageData.imageUrl !== ""
                ) {
                  const deleteFileResp =
                    await CategoryUtility.deleteUploadedCategoryImageToFS({
                      fileUrl: category?.imageData?.imageUrl,
                    });
                  let msg = `Category with category id ${categoryID} is deleted successfully with category image.`;
                  if (!deleteFileResp.isSucceeded) {
                    msg = `Category with category id ${categoryID} is deleted successfully but category image is not deleted. FileDeletionError: ${deleteFileResp?.message}`;
                  }
                  res.json({
                    status: "success",
                    message: msg,
                    data: {},
                  });
                } else {
                  res.json({
                    status: "success",
                    message: `Category with category id ${categoryID} is deleted successfully.`,
                    data: {},
                  });
                }
              } else {
                res.json({
                  status: "error",
                  message: `Category with category id ${categoryID} is not deleted.`,
                  data: {},
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "error",
                message: `There is an error occurred. ${err.message}`,
                data: {},
              });
            });
        } else {
          res.json({
            status: "error",
            message: `There is no category exists with categoryID ${categoryID}.`,
            data: {},
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "error",
          message: `There is an error occurred. ${err.message}`,
          data: {},
        });
      });
  }
};

module.exports.updateProductCategory = async (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "Send all required data to update a category.",
      data: {},
    });
    return;
  }
  if (!req?.params?.categoryID || req.params.categoryID === "") {
    res.json({
      status: "error",
      message: "Send category id in url.",
      data: {},
    });
    return;
  }
  if (!req?.body?.id || req.body.id === "") {
    res.json({
      status: "error",
      message: "Send id in body.",
      data: {},
    });
    return;
  }
  if (!req?.body?.title || req.body.title === "") {
    res.json({
      status: "error",
      message: "Send title in body.",
      data: {},
    });
    return;
  }
  if (!req?.body?.description || req.body.description === "") {
    res.json({
      status: "error",
      message: "Send description in body.",
      data: {},
    });
    return;
  }

  const categoryID = req.body.id;
  const categoryTitle = req.body.title;
  const isActive = req?.body?.isActive ?? false;
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
          isActive: isActive,
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
