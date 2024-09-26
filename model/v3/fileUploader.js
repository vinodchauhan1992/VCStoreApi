const mongoose = require("mongoose");
const schema = mongoose.Schema;

const fileUploaderSchema = new schema({
  fullPath: String,
  name: String,
  size: String,
  dateCreated: Date,
  dateUpdated: Date,
  contentType: String,
  imageUrl: String,
  fileFolderName: String,
  fileFolderPath: String,
  parentDocumentID: String,
  parentDocumentName: String,
});

module.exports = mongoose.model("uploaded_files_table_v3", fileUploaderSchema);
