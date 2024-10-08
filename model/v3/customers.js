const mongoose = require("mongoose");
const schema = mongoose.Schema;
const fileUploaderSchema = require("./fileUploader");

const customersSchema = new schema({
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
  customerCode: {
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
    address: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      required: true,
    },
    countryID: {
      type: String,
      required: true,
    },
    cityID: {
      type: String,
      required: true,
    },
    stateID: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
  },
  phone: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  genderID: {
    type: String,
    required: true,
  },
  incomeDetails: {
    monthlyIncome: {
      type: String,
      required: true,
    },
    annualIncome: {
      type: String,
      required: true,
    },
  },
  imageData: fileUploaderSchema.schema,
  dateOfBirth: {
    type: Date,
    required: true,
  },
  dateOfJoining: {
    type: Date,
    required: false,
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

module.exports = mongoose.model("customers_table_v3", customersSchema);
