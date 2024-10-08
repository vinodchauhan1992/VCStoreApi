const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userRolesSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  userType: {
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

module.exports = mongoose.model("user_roles", userRolesSchema);
