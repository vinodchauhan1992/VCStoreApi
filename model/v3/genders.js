const mongoose = require("mongoose");
const schema = mongoose.Schema;

const gendersSchema = new schema({
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
  isDeleteable: {
    type: Boolean,
    required: true,
  },
  isAdminDeleteable: {
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

module.exports = mongoose.model("genders_table_v3", gendersSchema);
