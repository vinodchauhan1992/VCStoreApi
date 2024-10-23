const mongoose = require("mongoose");
const schema = mongoose.Schema;
const fileUploaderSchema = require("./fileUploader");

const productsSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  shippingReturnDetails: {
    type: String,
    required: true,
  },
  highlights: {
    type: String,
    required: true,
  },
  colorID: {
    type: String,
    required: true,
  },
  categoryID: {
    type: String,
    required: true,
  },
  brandID: {
    type: String,
    required: true,
  },
  priceDetails: {
    purchasePrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    profitMargin: {
      type: Number,
      required: true,
    },
    maxDiscountPercentage: {
      type: Number,
      required: true,
    },
    maxDiscountValue: {
      type: Number,
      required: true,
    },
    profitAfterMaxDiscount: {
      type: Number,
      required: true,
    },
    isProfit: {
      type: Boolean,
      required: true,
    },
  },
  imageData: fileUploaderSchema.schema,
  dateAdded: {
    type: Date,
    required: true,
  },
  dateModified: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("products_table_v3", productsSchema);
