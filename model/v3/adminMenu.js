const mongoose = require("mongoose");
const schema = mongoose.Schema;

const adminMenuSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  menuTitle: {
    type: String,
    required: true,
  },
  menuPath: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
  },
  adminMenuStatusID: {
    type: String,
    required: true,
  },
  adminMenuStatus: {
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

module.exports = mongoose.model("admin_menu_table_v3", adminMenuSchema);
