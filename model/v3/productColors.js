const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productColorsSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  title: {
    type: schema.Types.String,
    required: true,
  },
  productColorNumber: {
    type: schema.Types.Number,
    required: true,
  },
  code: {
    type: schema.Types.String,
    required: true,
  },
  hexCode: {
    type: schema.Types.String,
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

module.exports = mongoose.model("product_colors_table_v3", productColorsSchema);
