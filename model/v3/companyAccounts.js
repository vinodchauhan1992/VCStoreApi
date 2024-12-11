const mongoose = require("mongoose");
const schema = mongoose.Schema;

const companyAccountsSchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  accountNumber: {
    type: schema.Types.String,
    required: true,
  },
  bankName: {
    type: schema.Types.String,
    required: true,
  },
  accountNickname: {
    type: schema.Types.String,
    required: true,
  },
  accountName: {
    type: schema.Types.String,
    required: true,
  },
  accountBalance: {
    type: schema.Types.Number,
    required: true,
  },
  dateAdded: {
    type: schema.Types.Date,
    required: true,
  },
  dateModified: {
    type: schema.Types.Date,
    required: true,
  },
});

module.exports = mongoose.model(
  "company_accounts_table_v3",
  companyAccountsSchema
);
