const mongoose = require("mongoose");
const schema = mongoose.Schema;

const invoicesSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  invoiceNumber: {
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
  orderDetails: {
    type: {},
    required: true,
  },
  fromAddress: {
    name: {
      type: schema.Types.String,
      required: true,
    },
    address1: {
      type: schema.Types.String,
      required: true,
    },
    address2: {
      type: schema.Types.String,
      required: false,
    },
    country: {
      type: schema.Types.String,
      required: true,
    },
    state: {
      type: schema.Types.String,
      required: true,
    },
    city: {
      type: schema.Types.String,
      required: true,
    },
    pincode: {
      type: schema.Types.Number,
      required: true,
    },
    phone: {
      type: schema.Types.Number,
      required: true,
    },
  },
  subTotal: {
    type: schema.Types.Number,
    required: true,
  },
  discount: {
    type: schema.Types.Number,
    required: true,
  },
  couponDiscount: {
    type: schema.Types.Number,
    required: true,
  },
  tax: {
    type: schema.Types.Number,
    required: true,
  },
  total: {
    type: schema.Types.Number,
    required: true,
  },
  dateAdded: {
    type: schema.Types.Date,
    required: true,
  },
});

module.exports = mongoose.model("invoices_table_v3", invoicesSchema);
