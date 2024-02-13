const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productsSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  image: String,
  categoryTitle: {
    type: String,
    required: true,
  },
  categoryCode: {
    type: String,
    required: true,
  },
  categoryID: {
    type: String,
    required: true,
  },
  rating: {
    rate: Number,
    count: Number,
  },
  dateAdded: {
    type: Date,
    required: true,
  },
  dateModified: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  status: {
    type: Number, //1 = In Stock, 2 = Out Of Stock, 3 = Soon In Stock
    required: true,
  },
});

module.exports = mongoose.model("products", productsSchema);
