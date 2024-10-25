const mongoose = require("mongoose");
const schema = mongoose.Schema;
const fileUploaderSchema = require("./fileUploader");

const productsSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  productNumber: {
    type: schema.Types.Number,
    required: true,
  },
  sku: {
    type: schema.Types.String,
    required: true,
  },
  title: {
    type: schema.Types.String,
    required: true,
  },
  description: {
    details: {
      type: schema.Types.String,
      required: true,
    },
    shortDescription: {
      type: schema.Types.String,
      required: true,
    },
    shippingReturnDetails: {
      type: schema.Types.String,
      required: true,
    },
    highlights: {
      type: schema.Types.String,
      required: true,
    },
  },
  colorID: {
    type: schema.Types.String,
    required: true,
  },
  categoryID: {
    type: schema.Types.String,
    required: true,
  },
  brandID: {
    type: schema.Types.String,
    required: true,
  },
  priceDetails: {
    purchasePrice: {
      type: schema.Types.Number,
      required: true,
    },
    sellingPrice: {
      type: schema.Types.Number,
      required: true,
    },
    profitMargin: {
      type: schema.Types.Number,
      required: true,
    },
    maxDiscountPercentage: {
      type: schema.Types.Number,
      required: true,
    },
    maxDiscountValue: {
      type: schema.Types.Number,
      required: true,
    },
    profitAfterMaxDiscount: {
      type: schema.Types.Number,
      required: true,
    },
    discountedPrice: {
      type: schema.Types.Number,
      required: true,
    },
    isProfit: {
      type: schema.Types.Boolean,
      required: true,
    },
  },
  isFreeShipping: {
    type: schema.Types.Boolean,
    required: true,
  },
  imageData: fileUploaderSchema.schema,
  dateAdded: {
    type: schema.Types.Date,
    required: true,
  },
  dateModified: {
    type: schema.Types.Date,
    required: true,
  },
});

module.exports = mongoose.model("products_table_v3", productsSchema);
