const mongoose = require("mongoose");
const schema = mongoose.Schema;

const employeeRolesSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  departmentID: {
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

module.exports = mongoose.model("employee_roles_table_v3", employeeRolesSchema);
