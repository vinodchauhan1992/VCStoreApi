const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  address: {
    address: String,
    city: String,
    state: String,
    zipcode: String,
  },
  phone: {
    type: String,
    required: true,
  },
  userType: {
    type: Number, //1=Admin, 2=user
    required: true,
  },
});

module.exports = mongoose.model("user", userSchema);