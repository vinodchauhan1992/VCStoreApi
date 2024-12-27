const mongoose = require("mongoose");
const schema = mongoose.Schema;
const fileUploaderSchema = require("./fileUploader");

const contactUsSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  name: {
    type: schema.Types.String,
    required: true,
  },
  email: {
    type: schema.Types.String,
    required: true,
  },
  subject: {
    type: schema.Types.String,
    required: true,
  },
  message: {
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

module.exports = mongoose.model("contact_us_table_v3", contactUsSchema);
