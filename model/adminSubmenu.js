const mongoose = require("mongoose");
const schema = mongoose.Schema;

const adminSubmenuSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  submenuTitle: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
  },
  adminMenuID: {
    type: String,
    required: true,
  },
  adminMenuTitle: {
    type: String,
    required: true,
  },
  statusID: {
    type: String,
    required: true,
  },
  status: {
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

module.exports = mongoose.model("admin_submenu", adminSubmenuSchema);
