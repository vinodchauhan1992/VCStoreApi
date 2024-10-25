const mongoose = require("mongoose");
const schema = mongoose.Schema;

const stocksSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  stockNumber: {
    type: schema.Types.Number,
    required: true,
  },
  code: {
    type: schema.Types.String,
    required: true,
  },
  productID: {
    type: schema.Types.String,
    required: true,
  },
  quantityAvailable: {
    type: schema.Types.Number,
    required: true,
  },
  quantitySold: {
    type: schema.Types.Number,
    required: true,
  },
  dateAdded: {
    type: schema.Types.Date,
    required: true,
  },
  dateModified: {
    type: schema.Types.Date,
    required: true,
  },
});

module.exports = mongoose.model("stocks_table_v3", stocksSchema);
