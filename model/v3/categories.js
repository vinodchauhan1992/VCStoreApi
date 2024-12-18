const mongoose = require("mongoose");
const schema = mongoose.Schema;
const fileUploaderSchema = require("./fileUploader");

const categoriesSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  categoryNumber: {
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
  description: {
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

module.exports = mongoose.model("categories_table_v3", categoriesSchema);
