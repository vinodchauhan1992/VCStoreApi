const mongoose = require("mongoose");
const schema = mongoose.Schema;

const statusesSchema = new schema({
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

module.exports = mongoose.model("statuses_table_v3", statusesSchema);
