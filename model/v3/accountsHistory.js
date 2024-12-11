const mongoose = require("mongoose");
const schema = mongoose.Schema;

const accountsHistorySchema = new schema({
  id: {
    type: schema.Types.String,
    required: true,
  },
  transactionMedium: {
    type: schema.Types.String, // 1 = "Credit card", 2 = "Debit card", 3 = "Cash", 4 = "Account transfer"
    required: true,
  },
  transactionType: {
    type: schema.Types.String, // 1 = "Credit", 2 = "Debit"
    required: true,
  },
  transactionStatus: {
    type: schema.Types.String, // 1 = "Success", 2 = "Failed"
    required: true,
  },
  transactionAmount: {
    type: schema.Types.Number,
    required: true,
  },
  availableBalance: {
    type: schema.Types.Number,
    required: true,
  },
  transactionFrom: {
    accountName: {
      type: schema.Types.String,
      required: true,
    },
    bankName: {
      type: schema.Types.String,
      required: true,
    },
    accountNumber: {
      type: schema.Types.String,
      required: true,
    },
    expiryMonth: {
      type: schema.Types.String, // ONLY VALID FOR CARD TRANSACTIONS
      required: false,
    },
    expiryYear: {
      type: schema.Types.String, // ONLY VALID FOR CARD TRANSACTIONS
      required: false,
    },
    cvv: {
      type: schema.Types.String, // ONLY VALID FOR CARD TRANSACTIONS
      required: false,
    },
  },
  transactionTo: {
    accountName: {
      type: schema.Types.String,
      required: true,
    },
    bankName: {
      type: schema.Types.String,
      required: true,
    },
    accountNumber: {
      type: schema.Types.String,
      required: true,
    },
    expiryMonth: {
      type: schema.Types.String, // ONLY VALID FOR CARD TRANSACTIONS
      required: false,
    },
    expiryYear: {
      type: schema.Types.String, // ONLY VALID FOR CARD TRANSACTIONS
      required: false,
    },
    cvv: {
      type: schema.Types.String, // ONLY VALID FOR CARD TRANSACTIONS
      required: false,
    },
  },
  dateAdded: {
    type: schema.Types.Date,
    required: true,
  },
});

module.exports = mongoose.model(
  "accounts_history_table_v3",
  accountsHistorySchema
);
