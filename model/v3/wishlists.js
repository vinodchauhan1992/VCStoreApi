const mongoose = require("mongoose");
const schema = mongoose.Schema;

const wishlistSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  wishlistNumber: {
    type: schema.Types.Number,
    required: true,
  },
  code: {
    type: schema.Types.String,
    required: true,
  },
  customerID: {
    type: schema.Types.String,
    required: true,
  },
  productID: {
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

module.exports = mongoose.model("wishlist_table_v3", wishlistSchema);
