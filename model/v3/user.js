const mongoose = require("mongoose");
const schema = mongoose.Schema;
const fileUploaderSchema = require("./fileUploader");

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
  userRoleID: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
  },
  userStatusID: {
    type: String,
    required: true,
  },
  userStatus: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  imageData: fileUploaderSchema.schema,
  dateOfBirth: {
    type: Date,
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

module.exports = mongoose.model("user_table_v3", userSchema);
