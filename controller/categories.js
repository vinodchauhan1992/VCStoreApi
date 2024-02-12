const Categories = require("../model/categories");
const CommonUtility = require("../utilities/commonUtility");

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
        dataObject.message = "Categories fetched successfully.";
        dataObject.data = categories;
      } else {
        dataObject.message =
          "Categories fetched successfully. But categories doesn't have any data.";
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
          dataObject.message = `Category with categoryID ${categoryID} fetched successfully.`;
          dataObject.data = category;
        } else {
          dataObject.message = `There is no category exists with categoryID ${categoryID}.`;
          dataObject.data = {};
        }
        res.json(dataObject);
      })
      .catch((err) => {
        dataObject.status = "error";
        dataObject.message = `There is an error occurred. ${err}`;
        res.json(dataObject);
      });
  }
};

module.exports.addProductCategory = (req, res) => {
  console.log("req_addProductCategory_body", req.body);
  if (typeof req.body == undefined) {
    dataObject.status = "error";
    dataObject.message = "Please send all required data to add a product.";
    res.json(dataObject);
  } else {
    const category = new Categories({
      id: CommonUtility.getUniqueID(req.body.title),
      title: req.body.title,
      code: req?.body?.title?.toLowerCase(),
      description: req.body.description,
      image: req.body.image,
    });

    category
      .save()
      .then((respondedCategory) => {
        if (respondedCategory && Object.keys(respondedCategory).length > 0) {
          dataObject.message = `New category is added successfully.`;
          dataObject.data = respondedCategory;
        } else {
          dataObject.message = `Category is not added due to unknown error.`;
          dataObject.data = {};
        }
        res.json(dataObject);
      })
      .catch((err) => {
        dataObject.status = "error";
        dataObject.message = `There is an error occurred. ${err}`;
        res.json(dataObject);
      });
  }
};
