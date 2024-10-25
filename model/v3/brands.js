const mongoose = require("mongoose");
const schema = mongoose.Schema;
const fileUploaderSchema = require("./fileUploader");

const brandsSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  brandNumber: {
    type: schema.Types.Number,
    required: true,
  },
  title: {
    type: schema.Types.String,
    required: true,
  },
  code: {
    type: schema.Types.String,
    required: true,
  },
  imageData: fileUploaderSchema.schema,
  dateAdded: {
    type: schema.Types.Date,
    required: true,
  },
  dateModified: {
    type: schema.Types.Date,
    required: true,
  },
});

module.exports = mongoose.model("brands_table_v3", brandsSchema);
