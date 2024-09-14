const Products = require("../../model/products");
const CommonUtility = require("../../utilities/commonUtility");

var dataObject = { status: "success", message: "", data: [] };

module.exports.getAllProducts = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Products.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((products) => {
      if (products && products.length > 0) {
        dataObject.message = "Products fetched successfully.";
        dataObject.data = products;
      } else {
        dataObject.message =
          "Products fetched successfully. But products doesn't have any data.";
      }
      res.json(dataObject);
    })
    .catch((err) => {
      dataObject.message = `There is an error occurred. ${err}`;
      dataObject.status = "error";
      res.json(dataObject);
    });
};

module.exports.getProduct = (req, res) => {
  if (!req?.params?.id || req.params.id === "") {
    dataObject.status = "error";
    dataObject.message = "Please send product id to get a product by id.";
    res.json(dataObject);
  } else {
    const id = req.params.id;

    Products.findOne({
      id,
    })
      .select(["-_id"])
      .then((product) => {
        if (product && Object.keys(product).length > 0) {
          dataObject.message = `Product with product id ${id} fetched successfully.`;
          dataObject.data = product;
        } else {
          dataObject.message = `There is no product exists with product id ${id}.`;
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

module.exports.getProductsInCategory = (req, res) => {
  if (!req?.params?.categoryID || req.params.categoryID === "") {
    dataObject.status = "error";
    dataObject.message =
      "Please send category id to get a product by category id.";
    res.json(dataObject);
  } else {
    const categoryID = req.params.categoryID;
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort == "desc" ? -1 : 1;

    Products.find({
      categoryID,
    })
      .select(["-_id"])
      .limit(limit)
      .sort({ id: sort })
      .then((products) => {
        if (products && products.length > 0) {
          dataObject.message = `Products with category id ${categoryID} fetched successfully.`;
          dataObject.data = products;
        } else {
          dataObject.message = `There are no products exists with category id ${categoryID}.`;
          dataObject.data = [];
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

module.exports.addProduct = (req, res) => {
  if (typeof req.body == undefined) {
    dataObject.status = "error";
    dataObject.message = "Please send all required data to add a product.";
    res.json(dataObject);
  } else {
    const product = new Products({
      id: CommonUtility.getUniqueID(),
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      categoryTitle: req.body.categoryTitle,
      categoryCode: req.body.categoryCode,
      categoryID: req.body.categoryID,
      rating: {
        rate: 0.0,
        count: 0,
      },
      dateAdded: new Date(),
      dateModified: new Date(),
      isActive: req.body.isActive,
      status: req.body.status,
    });

    product
      .save()
      .then((respondedProduct) => {
        if (respondedProduct && Object.keys(respondedProduct).length > 0) {
          dataObject.message = `New product is added successfully.`;
          dataObject.data = respondedProduct;
        } else {
          dataObject.message = `Product is not added due to unknown error.`;
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

module.exports.editProduct = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    dataObject.status = "error";
    dataObject.message = "something went wrong! check your sent data.";
    res.json(dataObject);
  } else {
    res.json({
      id: parseInt(req.params.id),
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      categoryTitle: req.body.categoryTitle,
      categoryCode: req.body.categoryCode,
      categoryID: req.body.categoryID,
      rating: {
        rate: req.body.rate,
        count: req.body.count,
      },
      dateModified: new Date(),
      isActive: req.body.isActive,
      status: req.body.status,
    });
  }
};

module.exports.deleteProduct = (req, res) => {
  if (req.params.id == null) {
    dataObject.status = "error";
    dataObject.message = "Product id must be provided to delete a product.";
    res.json(dataObject);
  } else {
    Products.findOne({
      id: req.params.id,
    })
      .select(["-_id"])
      .then((product) => {
        if (product && Object.keys(product).length > 0) {
          dataObject.message = `Product with product id ${id} is deleted successfully.`;
          dataObject.data = product;
        } else {
          dataObject.message = `Product with product id ${id} is not deleted.`;
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
