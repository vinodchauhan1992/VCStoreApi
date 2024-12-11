const AccountsHistorySchema = require("../../model/v3/accountsHistory");
const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");
const ConstantsUtility = require("./constantsUtility");

module.exports.getAllAccountsHistoryUtil = async ({ req }) => {
  return await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: AccountsHistorySchema,
    schemaName: "Accounts History",
  });
};

module.exports.getAccountHistoryByAccountHistoryIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: `Transaction id is required.`,
      data: {},
    };
  }
  const transactionID = req.body.id;
  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: AccountsHistorySchema,
    schemaName: "Accounts History",
    dataID: transactionID,
  });
};

module.exports.getAccountsHistoryByTransactionMediumUtil = async ({ req }) => {
  // Transaction medium can be "Credit card", "Debit card", "Cash", "Account transfer"
  if (!req?.body?.transactionMedium || req.body.transactionMedium === "") {
    return {
      status: "error",
      message: `Transaction medium is required.`,
      data: [],
    };
  }
  const transactionMedium = req.body.transactionMedium;
  if (
    transactionMedium !== "Credit card" &&
    transactionMedium !== "Debit card" &&
    transactionMedium !== "Cash" &&
    transactionMedium !== "Account transfer"
  ) {
    return {
      status: "error",
      message: `Transaction medium can only be "Credit card" or "Debit card" or "Cash" or "Account transfer".`,
      data: [],
    };
  }

  const foundDataObj = await CommonApisUtility.getDataArrayByCodeFromSchemaUtil(
    {
      schema: AccountsHistorySchema,
      schemaName: "Accounts History",
      dataCode: transactionMedium,
      keyname: "transactionMedium",
    }
  );
  if (foundDataObj?.status === "success") {
    return {
      ...foundDataObj,
      message: `Accounts history found by transaction medium "${transactionMedium}"`,
    };
  }
  return {
    ...foundDataObj,
    message: `Accounts history not found by transaction medium "${transactionMedium}"`,
  };
};

module.exports.getAccountsHistoryByTransactionTypeUtil = async ({ req }) => {
  // Transaction type can be "Credit", "Debit"
  if (!req?.body?.transactionType || req.body.transactionType === "") {
    return {
      status: "error",
      message: `Transaction type is required.`,
      data: [],
    };
  }
  const transactionType = req.body.transactionType;
  if (transactionType !== "Credit" && transactionType !== "Debit") {
    return {
      status: "error",
      message: `Transaction type can only be "Credit" or "Debit".`,
      data: [],
    };
  }

  const foundDataObj = await CommonApisUtility.getDataArrayByCodeFromSchemaUtil(
    {
      schema: AccountsHistorySchema,
      schemaName: "Accounts History",
      dataCode: transactionType,
      keyname: "transactionType",
    }
  );
  if (foundDataObj?.status === "success") {
    return {
      ...foundDataObj,
      message: `Accounts history found by transaction type "${transactionType}"`,
    };
  }
  return {
    ...foundDataObj,
    message: `Accounts history not found by transaction type "${transactionType}"`,
  };
};

module.exports.getAccountsHistoryByTransactionStatusUtil = async ({ req }) => {
  // Transaction status can be "Success", "Failed"
  if (!req?.body?.transactionStatus || req.body.transactionStatus === "") {
    return {
      status: "error",
      message: `Transaction status is required.`,
      data: [],
    };
  }
  const transactionStatus = req.body.transactionStatus;
  if (transactionStatus !== "Success" && transactionStatus !== "Failed") {
    return {
      status: "error",
      message: `Transaction status can only be "Success" or "Failed".`,
      data: [],
    };
  }

  const foundDataObj = await CommonApisUtility.getDataArrayByCodeFromSchemaUtil(
    {
      schema: AccountsHistorySchema,
      schemaName: "Accounts History",
      dataCode: transactionStatus,
      keyname: "transactionStatus",
    }
  );
  if (foundDataObj?.status === "success") {
    return {
      ...foundDataObj,
      message: `Accounts history found by transaction status "${transactionStatus}"`,
    };
  }
  return {
    ...foundDataObj,
    message: `Accounts history not found by transaction status "${transactionStatus}"`,
  };
};

module.exports.addAccountHistoryForCardsUtil = async ({ req }) => {
  if (!req?.body?.toAccountName || req.body.toAccountName === "") {
    return {
      status: "error",
      message: `Transaction to account name is required.`,
      data: {},
    };
  }
  if (!req?.body?.toBankName || req.body.toBankName === "") {
    return {
      status: "error",
      message: `Transaction to bank name is required.`,
      data: {},
    };
  }
  if (!req?.body?.toAccountNumber || req.body.toAccountNumber === "") {
    return {
      status: "error",
      message: `Transaction to account number is required.`,
      data: {},
    };
  }
  if (!req?.body?.fromAccountName || req.body.fromAccountName === "") {
    return {
      status: "error",
      message: `Transaction from account name is required.`,
      data: {},
    };
  }
  if (!req?.body?.fromBankName || req.body.fromBankName === "") {
    return {
      status: "error",
      message: `Transaction from bank name is required.`,
      data: {},
    };
  }
  if (!req?.body?.fromAccountNumber || req.body.fromAccountNumber === "") {
    return {
      status: "error",
      message: `Transaction from account number is required.`,
      data: {},
    };
  }
  if (!req?.body?.expiryMonth || req.body.expiryMonth === "") {
    return {
      status: "error",
      message: `Expiry month is required.`,
      data: {},
    };
  }
  if (!req?.body?.expiryYear || req.body.expiryYear === "") {
    return {
      status: "error",
      message: `Expiry year is required.`,
      data: {},
    };
  }
  if (!req?.body?.cvv || req.body.cvv === "") {
    return {
      status: "error",
      message: `CVV is required.`,
      data: {},
    };
  }
  const {
    id,
    transactionMedium,
    transactionType,
    transactionStatus,
    transactionAmount,
    availableBalance,
    toAccountName,
    toBankName,
    toAccountNumber,
    fromAccountName,
    fromBankName,
    fromAccountNumber,
    expiryMonth,
    expiryYear,
    cvv,
  } = req.body;

  const dateAdded = new Date();

  const newAccountHistorySchema = new AccountsHistorySchema({
    id: id,
    transactionMedium: transactionMedium,
    transactionType: transactionType,
    transactionStatus: transactionStatus,
    transactionAmount: CommonUtility.amountRoundingFunc({
      value: transactionAmount,
    }),
    availableBalance: CommonUtility.amountRoundingFunc({
      value: availableBalance,
    }),
    transactionFrom: {
      accountName: fromAccountName,
      bankName: fromBankName,
      accountNumber: fromAccountNumber,
      expiryMonth: expiryMonth,
      expiryYear: expiryYear,
      cvv: cvv,
    },
    transactionTo: {
      accountName: toAccountName,
      bankName: toBankName,
      accountNumber: toAccountNumber,
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
    dateAdded: dateAdded,
  });

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newAccountHistorySchema,
    schemaName: "Accounts History",
  });
};

module.exports.addAccountHistoryForCashUtil = async ({ req }) => {
  if (!req?.body?.toAccountName || req.body.toAccountName === "") {
    return {
      status: "error",
      message: `Transaction to account name is required.`,
      data: {},
    };
  }
  if (!req?.body?.toBankName || req.body.toBankName === "") {
    return {
      status: "error",
      message: `Transaction to bank name is required.`,
      data: {},
    };
  }
  if (!req?.body?.toAccountNumber || req.body.toAccountNumber === "") {
    return {
      status: "error",
      message: `Transaction to account number is required.`,
      data: {},
    };
  }
  const {
    id,
    transactionMedium,
    transactionType,
    transactionStatus,
    transactionAmount,
    availableBalance,
    toAccountName,
    toBankName,
    toAccountNumber,
  } = req.body;

  const { accountName, bankName, accountNumber } =
    ConstantsUtility.utils.BANK_ACCOUNT_FOR_CASH_DEPOSIT;
  const dateAdded = new Date();

  const newAccountHistorySchema = new AccountsHistorySchema({
    id: id,
    transactionMedium: transactionMedium,
    transactionType: transactionType,
    transactionStatus: transactionStatus,
    transactionAmount: CommonUtility.amountRoundingFunc({
      value: transactionAmount,
    }),
    availableBalance: CommonUtility.amountRoundingFunc({
      value: availableBalance,
    }),
    transactionFrom: {
      accountName: accountName,
      bankName: bankName,
      accountNumber: accountNumber,
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
    transactionTo: {
      accountName: toAccountName,
      bankName: toBankName,
      accountNumber: toAccountNumber,
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
    dateAdded: dateAdded,
  });

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newAccountHistorySchema,
    schemaName: "Accounts History",
  });
};

module.exports.addAccountHistoryForAccountTransferUtil = async ({ req }) => {
  if (!req?.body?.toAccountName || req.body.toAccountName === "") {
    return {
      status: "error",
      message: `Transaction to account name is required.`,
      data: {},
    };
  }
  if (!req?.body?.toBankName || req.body.toBankName === "") {
    return {
      status: "error",
      message: `Transaction to bank name is required.`,
      data: {},
    };
  }
  if (!req?.body?.toAccountNumber || req.body.toAccountNumber === "") {
    return {
      status: "error",
      message: `Transaction to account number is required.`,
      data: {},
    };
  }
  if (!req?.body?.fromAccountName || req.body.fromAccountName === "") {
    return {
      status: "error",
      message: `Transaction from account name is required.`,
      data: {},
    };
  }
  if (!req?.body?.fromBankName || req.body.fromBankName === "") {
    return {
      status: "error",
      message: `Transaction from bank name is required.`,
      data: {},
    };
  }
  if (!req?.body?.fromAccountNumber || req.body.fromAccountNumber === "") {
    return {
      status: "error",
      message: `Transaction from account number is required.`,
      data: {},
    };
  }
  const {
    id,
    transactionMedium,
    transactionType,
    transactionStatus,
    transactionAmount,
    availableBalance,
    toAccountName,
    toBankName,
    toAccountNumber,
    fromAccountName,
    fromBankName,
    fromAccountNumber,
  } = req.body;

  const dateAdded = new Date();

  const newAccountHistorySchema = new AccountsHistorySchema({
    id: id,
    transactionMedium: transactionMedium,
    transactionType: transactionType,
    transactionStatus: transactionStatus,
    transactionAmount: CommonUtility.amountRoundingFunc({
      value: transactionAmount,
    }),
    availableBalance: CommonUtility.amountRoundingFunc({
      value: availableBalance,
    }),
    transactionFrom: {
      accountName: fromAccountName,
      bankName: fromBankName,
      accountNumber: fromAccountNumber,
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
    transactionTo: {
      accountName: toAccountName,
      bankName: toBankName,
      accountNumber: toAccountNumber,
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
    dateAdded: dateAdded,
  });

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newAccountHistorySchema,
    schemaName: "Accounts History",
  });
};

module.exports.addNewAccountHistoryUtil = async ({ req }) => {
  if (!req?.body?.transactionMedium || req.body.transactionMedium === "") {
    return {
      status: "error",
      message: `Transaction medium is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.transactionMedium)) {
    return {
      status: "error",
      message: `Transaction medium must be a number.`,
      data: {},
    };
  }
  const transactionMedium = Number(req.body.transactionMedium);
  if (transactionMedium < 1 && transactionMedium > 4) {
    return {
      status: "error",
      message: `Transaction medium cannot be less than 1 and greater than 4.`,
      data: {},
    };
  }
  if (!req?.body?.transactionType || req.body.transactionType === "") {
    return {
      status: "error",
      message: `Transaction type is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.transactionType)) {
    return {
      status: "error",
      message: `Transaction type must be a number.`,
      data: {},
    };
  }
  const transactionType = Number(req.body.transactionType);
  if (transactionType < 1 && transactionType > 2) {
    return {
      status: "error",
      message: `Transaction type cannot be less than 1 and greater than 2.`,
      data: {},
    };
  }
  if (!req?.body?.transactionStatus || req.body.transactionStatus === "") {
    return {
      status: "error",
      message: `Transaction status is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.transactionStatus)) {
    return {
      status: "error",
      message: `Transaction status must be a number.`,
      data: {},
    };
  }
  const transactionStatus = Number(req.body.transactionStatus);
  if (transactionStatus < 1 && transactionStatus > 2) {
    return {
      status: "error",
      message: `Transaction status cannot be less than 1 and greater than 2.`,
      data: {},
    };
  }
  if (!req?.body?.transactionAmount || req.body.transactionAmount === "") {
    return {
      status: "error",
      message: `Transaction amount is required.`,
      data: {},
    };
  }
  if (isNaN(req.body.transactionAmount)) {
    return {
      status: "error",
      message: `Transaction amount must be a number.`,
      data: {},
    };
  }
  const transactionAmount = Number(req.body.transactionAmount);
  if (transactionAmount < 1) {
    return {
      status: "error",
      message: `Transaction amount cannot be 0.`,
      data: {},
    };
  }
  const id = CommonUtility.getUniqueID();
  const availableBalance =
    req?.body?.availableBalance &&
    req.body.availableBalance !== "" &&
    !isNaN(req.body.availableBalance)
      ? Number(req.body.availableBalance)
      : 0;

  const commonRequestBody = {
    id: id,
    availableBalance: availableBalance,
    transactionType: transactionType === 1 ? "Credit" : "Debit",
    transactionStatus: transactionStatus === 1 ? "Success" : "Failed",
    transactionAmount: transactionAmount,
  };

  switch (transactionMedium) {
    case 2:
      // 2 = "Debit card"
      return await this.addAccountHistoryForCardsUtil({
        req: {
          body: {
            ...req.body,
            ...commonRequestBody,
            transactionMedium: "Debit card",
          },
        },
      });

    case 3:
      // 3 = "Cash"
      return await this.addAccountHistoryForCashUtil({
        req: {
          body: {
            ...req.body,
            ...commonRequestBody,
            transactionMedium: "Cash",
          },
        },
      });

    case 4:
      // 4 = "Account transfer"
      return await this.addAccountHistoryForAccountTransferUtil({
        req: {
          body: {
            ...req.body,
            ...commonRequestBody,
            transactionMedium: "Account transfer",
          },
        },
      });

    default:
      // 1 = "Credit card"
      return await this.addAccountHistoryForCardsUtil({
        req: {
          body: {
            ...req.body,
            ...commonRequestBody,
            transactionMedium: "Credit card",
          },
        },
      });
  }
};

module.exports.deleteAllAccountsHistoryUtil = async ({ req }) => {
  return await CommonApisUtility.deleteAllDataFromSchemaUtil({
    schema: AccountsHistorySchema,
    schemaName: "Accounts History",
  });
};
