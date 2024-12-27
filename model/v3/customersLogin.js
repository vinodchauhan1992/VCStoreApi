const mongoose = require("mongoose");
const schema = mongoose.Schema;

const customersLoginSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  appID: {
    type: String,
    required: true,
  },
  customerID: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  jwtToken: {
    type: String,
    required: true,
  },
  loginDateTime: {
    type: Date,
    required: true,
  },
  logoutDateTime: {
    type: Date,
    required: false,
  },
  isLogout: {
    type: Boolean,
    required: false,
  },
});

module.exports = mongoose.model(
  "customer_login_table_v3",
  customersLoginSchema
);
