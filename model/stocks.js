const mongoose = require("mongoose");
const schema = mongoose.Schema;

const stocksSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  brandId: {
    type: String,
    required: true,
  },
  totalQuantities: {
    type: Number,
    required: true,
  },
  quantityRecieved: {
    type: Number,
    required: true,
  },
  quantityAvailable: {
    type: Number,
    required: true,
  },
  dateAdded: {
    type: Date,
    required: true,
  },
  dateModified: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("stocks", stocksSchema);
