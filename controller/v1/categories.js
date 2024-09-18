const Categories = require("../../model/categories");
const CommonUtility = require("../../utilities/commonUtility");
var http = require("http");

let dataObject = { status: "success", message: "", data: [] };

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

module.exports.addProductCategory = (req, res) => {
  if (typeof req.body == undefined) {
    dataObject.status = "error";
    dataObject.message = "Please send all required data to add a category.";
    dataObject.data = {};
    res.json(dataObject);
  } else {
    const category = new Categories({
      id: CommonUtility.getUniqueID(),
      title: req.body.title,
      code: req?.body?.title?.toLowerCase(),
      description: req.body.description,
      imageData: req.body.imageData,
      dateAdded: new Date(),
      dateModified: new Date(),
    });

    category
      .save()
      .then((respondedCategory) => {
        if (respondedCategory && Object.keys(respondedCategory).length > 0) {
          dataObject.status = "success";
          dataObject.message = `New category is added successfully.`;
          dataObject.data = respondedCategory;
          res.json(dataObject);
        } else {
          dataObject.status = "error";
          dataObject.message = `Category is not added due to unknown error.`;
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

module.exports.deleteProductCategory = (req, res) => {
  if (req.params.categoryID == null) {
    dataObject.status = "error";
    dataObject.message = "Category id must be provided to delete a category.";
    dataObject.data = {};
    res.json(dataObject);
  } else {
    Categories.deleteOne({
      id: req.params.categoryID,
    })
      .select(["-_id"])
      .then((result) => {
        if (result && result.deletedCount === 1) {
          dataObject.status = "success";
          dataObject.message = `Category with category id ${req.params.categoryID} is deleted successfully.`;
          dataObject.data = {};
        } else {
          dataObject.status = "error";
          dataObject.message = `Category with category id ${req.params.categoryID} is not deleted.`;
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

module.exports.updateProductCategory = (req, res) => {
  if (typeof req.body == undefined || req.params.categoryID == null) {
    dataObject.status = "error";
    dataObject.message = "Please send all required data to update a category.";
    dataObject.data = {};
    res.json(dataObject);
  } else {
    const categoryID = req.params.categoryID;

    Categories.findOne({
      id: categoryID,
    })
      .select(["-_id"])
      .then((currentCategory) => {
        if (currentCategory && Object.keys(currentCategory).length > 0) {
          const newCategory = {
            id: req.body.id,
            title: req.body.title,
            code: req?.body?.title?.toLowerCase(),
            description: req.body.description,
            image: req.body.image,
            dateAdded: req.body.dateAdded,
            dateModified: new Date(),
          };

          const updatedCategorySet = {
            $set: newCategory,
          };

          Categories.updateOne({ id: req.body.id }, updatedCategorySet)
            .then((respondedCategory) => {
              if (
                respondedCategory &&
                Object.keys(respondedCategory).length > 0
              ) {
                dataObject.status = "success";
                dataObject.message = `Category is updated successfully.`;
                dataObject.data = newCategory;
              } else {
                dataObject.status = "error";
                dataObject.message = `Category is not updated due to unknown error.`;
                dataObject.data = {};
              }
              res.json(dataObject);
              return;
            })
            .catch((err) => {
              dataObject.status = "error";
              dataObject.message = `There is an error occurred. ${err}`;
              dataObject.data = {};
              res.json(dataObject);
              return;
            });
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
  }
};
