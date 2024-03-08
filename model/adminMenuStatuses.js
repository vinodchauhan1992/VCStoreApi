const mongoose = require("mongoose");
const schema = mongoose.Schema;

const adminMenuStatusesSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  menuStatusTitle: {
    type: String,
    required: true,
  },
  menuStatusDescription: {
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

module.exports = mongoose.model("admin_menu_statuses", adminMenuStatusesSchema);
