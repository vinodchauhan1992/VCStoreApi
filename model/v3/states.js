const mongoose = require("mongoose");
const schema = mongoose.Schema;

const statesSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  countryID: {
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
  dateAdded: {
    type: Date,
    required: true,
  },
  dateModified: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("states_table_v3", statesSchema);
