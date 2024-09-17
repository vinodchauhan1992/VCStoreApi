const mongoose = require("mongoose");
const schema = mongoose.Schema;
const fileUploaderSchema = require("./fileUploader");

const productsSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  categoryDetails: {
    categoryTitle: String,
    categoryCode: String,
    categoryID: String,
  },
  brandDetails: {
    brandTitle: String,
    brandCode: String,
    brandID: String,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  rating: {
    rate: Number,
    count: Number,
  },
  priceDetails: {
    purchasePrice: Number,
    sellingPrice: Number,
    profitMargin: Number,
    maxDiscountPercentage: Number,
    maxDiscountValue: Number,
    profitAfterMaxDiscount: Number,
    isProfit: Boolean,
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

module.exports = mongoose.model("products", productsSchema);
