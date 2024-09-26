const mongoose = require("mongoose");
const schema = mongoose.Schema;
const fileUploaderSchema = require("./fileUploader");

const brandsSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  brandLogo: fileUploaderSchema.schema,
  isActive: {
    type: Boolean,
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

module.exports = mongoose.model("brands_table_v3", brandsSchema);
