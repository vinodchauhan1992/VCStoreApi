const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ordersSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  orderNumber: {
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
  cart: {
    type: {},
    required: true,
  },
  contactInfo: {
    email: {
      type: schema.Types.String,
      required: true,
    },
    phone: {
      type: schema.Types.Number,
      required: true,
    },
  },
  shippingInfo: {
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
  },
  billingInfo: {
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
  },
  paymentInfo: {
    cardName: {
      type: schema.Types.String,
      required: true,
    },
    cardType: {
      type: schema.Types.String,
      required: true,
    },
    cardNumber: {
      type: schema.Types.Number,
      required: true,
    },
    cardExpiryMonth: {
      type: schema.Types.Number,
      required: true,
    },
    cardExpiryYear: {
      type: schema.Types.Number,
      required: true,
    },
    cardCVV: {
      type: schema.Types.Number,
      required: true,
    },
  },
  deliveryStatusID: {
    type: schema.Types.String,
    required: true,
  },
  invoiceID: {
    type: schema.Types.String,
    required: false,
  },
  deliveryDate: {
    type: schema.Types.Date,
    required: false,
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

module.exports = mongoose.model("orders_table_v3", ordersSchema);
