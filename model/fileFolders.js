const mongoose = require("mongoose");
const schema = mongoose.Schema;

const fileFoldersSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  folderName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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

module.exports = mongoose.model("file_folders", fileFoldersSchema);
