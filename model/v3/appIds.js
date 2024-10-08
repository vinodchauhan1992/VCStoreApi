const mongoose = require("mongoose");
const schema = mongoose.Schema;

const appIdsSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  title: {
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

module.exports = mongoose.model("app_ids_table_v3", appIdsSchema);
