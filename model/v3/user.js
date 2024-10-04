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
    countryID: String,
    cityID: String,
    stateID: String,
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
  userStatusID: {
    type: String,
    required: true,
  },
  genderID: {
    // male_01 = Male, female_02 = Female, other_03 = Other
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  genderDescription: {
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
