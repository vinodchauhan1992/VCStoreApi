const mongoose = require("mongoose");
const schema = mongoose.Schema;
const fileUploaderSchema = require("./fileUploader");

const customersSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  customerNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: schema.Types.String,
    required: true,
  },
  username: {
    type: schema.Types.String,
    required: true,
  },
  customerCode: {
    type: schema.Types.String,
    required: true,
  },
  password: {
    type: schema.Types.String,
    required: true,
  },
  name: {
    firstname: {
      type: schema.Types.String,
      required: true,
    },
    lastname: {
      type: schema.Types.String,
      required: true,
    },
  },
  address: {
    address: {
      type: schema.Types.String,
      required: true,
    },
    street: {
      type: schema.Types.String,
      required: true,
    },
    landmark: {
      type: schema.Types.String,
      required: true,
    },
    countryID: {
      type: schema.Types.String,
      required: true,
    },
    cityID: {
      type: schema.Types.String,
      required: true,
    },
    stateID: {
      type: schema.Types.String,
      required: true,
    },
    pincode: {
      type: schema.Types.String,
      required: true,
    },
  },
  phone: {
    type: schema.Types.String,
    required: true,
  },
  isActive: {
    type: schema.Types.Boolean,
    required: true,
  },
  genderID: {
    type: schema.Types.String,
    required: true,
  },
  incomeDetails: {
    monthlyIncome: {
      type: schema.Types.Number,
      required: true,
    },
    annualIncome: {
      type: schema.Types.Number,
      required: true,
    },
  },
  imageData: fileUploaderSchema.schema,
  dateOfBirth: {
    type: schema.Types.Date,
    required: true,
  },
  dateOfRegistration: {
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

module.exports = mongoose.model("customers_table_v3", customersSchema);
