const mongoose = require("mongoose");
const schema = mongoose.Schema;

const employeeSalariesSchema = new schema({
  id: {
    type: String,
    required: true,
  },
  employeeID: {
    type: String,
    required: true,
  },
  monthlyHra: {
    type: Number,
    required: true,
  },
  monthlyDa: {
    type: Number,
    required: true,
  },
  monthlyCa: {
    type: Number,
    required: true,
  },
  monthlyBasicSalary: {
    type: Number,
    required: true,
  },
  monthlyPfDeduction: {
    type: Number,
    required: true,
  },
  monthlyCtc: {
    type: Number,
    required: true,
  },
  annualHra: {
    type: Number,
    required: true,
  },
  annualDa: {
    type: Number,
    required: true,
  },
  annualCa: {
    type: Number,
    required: true,
  },
  annualBasicSalary: {
    type: Number,
    required: true,
  },
  annualPfDeduction: {
    type: Number,
    required: true,
  },
  annualCtc: {
    type: Number,
    required: true,
  },
  monthlyTaxDeduction: {
    type: Number,
    required: true,
  },
  annualTaxDeduction: {
    type: Number,
    required: true,
  },
  monthlySalaryInHand: {
    type: Number,
    required: true,
  },
  annualSalaryInHand: {
    type: Number,
    required: true,
  },
  isNewTaxRegime: {
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

module.exports = mongoose.model(
  "employee_salaries_table_v3",
  employeeSalariesSchema
);
