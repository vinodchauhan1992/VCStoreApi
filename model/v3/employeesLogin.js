const mongoose = require("mongoose");
const schema = mongoose.Schema;

const employeesLoginSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  employeeID: {
    type: String,
    required: true,
  },
  employeeCode: {
    type: String,
    required: true,
  },
  jwtToken: {
    type: String,
    required: true,
  },
  loginDateTime: {
    type: Date,
    required: true,
  },
  logoutDateTime: {
    type: Date,
    required: false,
  },
  isLogout: {
    type: Boolean,
    required: false,
  },
});

module.exports = mongoose.model(
  "employee_login_table_v3",
  employeesLoginSchema
);
