const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userDropdownMenuSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  title: {
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
  isActive: {
    type: Boolean,
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

module.exports = mongoose.model("user_dropdown_menu", userDropdownMenuSchema);
