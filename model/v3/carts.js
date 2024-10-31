const mongoose = require("mongoose");
const schema = mongoose.Schema;

const cartsSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  cartNumber: {
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
  products: {
    type: [
      {
        productID: {
          type: schema.Types.String,
        },
        count: {
          type: schema.Types.Number,
        },
      },
    ],
    default: [],
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

module.exports = mongoose.model("carts_table_v3", cartsSchema);
