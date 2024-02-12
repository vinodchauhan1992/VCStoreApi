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
});

module.exports = mongoose.model("products", productsSchema);
