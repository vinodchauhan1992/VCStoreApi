const CompanyAccountsSchema = require("../../model/v3/companyAccounts");
const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");
const AccountsHistoryUtility = require("./accountsHistoryUtility");

module.exports.getAllCompanyAccountsUtil = async ({ req }) => {
  return await CommonApisUtility.getAllDataFromSchemaUtil({
    req: req,
    schema: CompanyAccountsSchema,
    schemaName: "Company Accounts",
  });
};

module.exports.getCompanyAccountByAccountIDUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Company account id is required.",
      data: {},
    };
  }

  const companyAccountID = req.body.id;

  return await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CompanyAccountsSchema,
    schemaName: "Company Account",
    dataID: companyAccountID,
  });
};

module.exports.getCompanyAccountByAccountNumberUtil = async ({ req }) => {
  if (!req?.body?.accountNumber || req.body.accountNumber === "") {
    return {
      status: "error",
      message: "Account number is required.",
      data: {},
    };
  }

  const accountNumber = req.body.accountNumber;

  const foundItemObj = await CommonApisUtility.getDataByIdFromSchemaUtil({
    schema: CompanyAccountsSchema,
    schemaName: "Company Account",
    dataID: accountNumber,
    keyname: "accountNumber",
  });
  if (foundItemObj?.status === "success") {
    return {
      ...foundItemObj,
      message: `Account found with account number ${accountNumber}`,
    };
  }
  return {
    ...foundItemObj,
    message: `Account doesn't exists with account number ${accountNumber}`,
  };
};

module.exports.getCompanyAccountsByBankNameUtil = async ({ req }) => {
  if (!req?.body?.bankName || req.body.bankName === "") {
    return {
      status: "error",
      message: "Bank name is required.",
      data: [],
    };
  }

  const bankName = req.body.bankName;

  return await CommonApisUtility.getDataArrayByCodeFromSchemaUtil({
    schema: CompanyAccountsSchema,
    schemaName: "Company Account",
    dataCode: bankName,
    keyname: "bankName",
  });
};

module.exports.getCompanyAccountByAccountNicknameUtil = async ({ req }) => {
  if (!req?.body?.accountNickname || req.body.accountNickname === "") {
    return {
      status: "error",
      message: "Account nickname is required.",
      data: {},
    };
  }

  const accountNickname = req.body.accountNickname;

  return await CommonApisUtility.getDataByCodeFromSchemaUtil({
    schema: CompanyAccountsSchema,
    schemaName: "Company Account",
    dataCode: accountNickname,
    keyname: "accountNickname",
  });
};

module.exports.addNewCompanyAccountUtil = async ({ req }) => {
  if (!req?.body?.accountName || req.body.accountName === "") {
    return {
      status: "error",
      message: "Account name is required.",
      data: {},
    };
  }
  if (!req?.body?.bankName || req.body.bankName === "") {
    return {
      status: "error",
      message: "Bank name is required.",
      data: {},
    };
  }
  if (!req?.body?.accountNickname || req.body.accountNickname === "") {
    return {
      status: "error",
      message: "Account nickname is required.",
      data: {},
    };
  }
  if (!req?.body?.accountNumber || req.body.accountNumber === "") {
    return {
      status: "error",
      message: "Account number is required.",
      data: {},
    };
  }
  if (req.body.accountNumber.length < 16) {
    return {
      status: "error",
      message: "Account number must be equal or greater than 16 digits.",
      data: {},
    };
  }

  const accountID = CommonUtility.getUniqueID();
  const accountName = req.body.accountName;
  const bankName = req.body.bankName;
  const accountNickname = req.body.accountNickname;
  const accountNumber = req.body.accountNumber;
  const accountBalance = 0;
  const dateAdded = new Date();
  const dateModified = new Date();

  const foundAccountByAccNumberObj =
    await this.getCompanyAccountByAccountNumberUtil({
      req: {
        body: {
          accountNumber: accountNumber,
        },
      },
    });
  if (foundAccountByAccNumberObj?.status === "success") {
    return {
      status: "error",
      message: `Company account with account number ${accountNumber} already exists.`,
      data: {},
    };
  }

  const foundAccountByAccNicknameObj =
    await this.getCompanyAccountByAccountNicknameUtil({
      req: {
        body: {
          accountNickname: accountNickname,
        },
      },
    });
  if (foundAccountByAccNicknameObj?.status === "success") {
    return {
      status: "error",
      message: `Company account with account nickname ${accountNickname} already exists.`,
      data: {},
    };
  }

  const newAccountSchema = CompanyAccountsSchema({
    id: accountID,
    accountNumber: accountNumber,
    bankName: bankName,
    accountName: accountName,
    accountNickname: accountNickname,
    accountBalance: accountBalance,
    dateAdded: dateAdded,
    dateModified: dateModified,
  });

  return await CommonApisUtility.addNewDataToSchemaUtil({
    newSchema: newAccountSchema,
    schemaName: "Company Account",
  });
};

module.exports.deleteCompanyAccountUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Account id is required.",
      data: {},
    };
  }

  const accountID = req.body.id;

  const foundAccountByAccIDObj = await this.getCompanyAccountByAccountIDUtil({
    req: {
      body: {
        id: accountID,
      },
    },
  });
  if (foundAccountByAccIDObj?.status === "error") {
    return foundAccountByAccIDObj;
  }
  if (
    foundAccountByAccIDObj?.data?.accountBalance &&
    Number(foundAccountByAccIDObj.data.accountBalance) > 0
  ) {
    return {
      status: "error",
      message: `There is balance in account. Please transfer the balance to your another account then you can delete the account.`,
      data: {},
    };
  }

  return await CommonApisUtility.deleteDataByIdFromSchemaUtil({
    schema: CompanyAccountsSchema,
    schemaName: "Company Account",
    dataID: accountID,
  });
};

module.exports.updateCompanyAccountBasicDetailsUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Account id is required.",
      data: {},
    };
  }
  if (!req?.body?.accountName || req.body.accountName === "") {
    return {
      status: "error",
      message: "Account name is required.",
      data: {},
    };
  }
  if (!req?.body?.accountNickname || req.body.accountNickname === "") {
    return {
      status: "error",
      message: "Account nickname is required.",
      data: {},
    };
  }

  const accountID = req.body.id;
  const accountName = req.body.accountName;
  const accountNickname = req.body.accountNickname;
  const dateModified = new Date();

  const foundAccountByAccIDObj = await this.getCompanyAccountByAccountIDUtil({
    req: {
      body: {
        id: accountID,
      },
    },
  });
  if (foundAccountByAccIDObj?.status === "error") {
    return foundAccountByAccIDObj;
  }

  const foundAccountByAccNicknameObj =
    await this.getCompanyAccountByAccountNicknameUtil({
      req: {
        body: {
          accountNickname: accountNickname,
        },
      },
    });
  if (
    foundAccountByAccNicknameObj?.status === "success" &&
    foundAccountByAccNicknameObj?.data?.id !== accountID &&
    foundAccountByAccNicknameObj?.data?.accountNickname === accountNickname
  ) {
    return {
      status: "error",
      message: `Another company account with account nickname ${accountNickname} already exists.`,
      data: {},
    };
  }

  const newCompanyAccount = {
    id: accountID,
    accountName: accountName,
    accountNickname: accountNickname,
    dateModified: dateModified,
  };

  const updatedCompanyAccountSet = {
    $set: newCompanyAccount,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: CompanyAccountsSchema,
    newDataObject: newCompanyAccount,
    updatedDataSet: updatedCompanyAccountSet,
    schemaName: "Company Account",
    dataID: accountID,
  });
};

module.exports.addAccountBalanceViaCashUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Account id is required.",
      data: {},
    };
  }
  if (
    req?.body?.accountBalance === undefined ||
    req.body.accountBalance === null ||
    req.body.accountBalance === ""
  ) {
    return {
      status: "error",
      message: "Account balance is required.",
      data: {},
    };
  }
  if (isNaN(req.body.accountBalance)) {
    return {
      status: "error",
      message: "Account balance must be a number.",
      data: {},
    };
  }

  const accountID = req.body.id;
  const accountBalance = req.body.accountBalance;
  const dateModified = new Date();

  const foundAccountByAccIDObj = await this.getCompanyAccountByAccountIDUtil({
    req: {
      body: {
        id: accountID,
      },
    },
  });
  if (foundAccountByAccIDObj?.status === "error") {
    return foundAccountByAccIDObj;
  }

  const updatedAccountBalance =
    Number(accountBalance) + Number(foundAccountByAccIDObj.data.accountBalance);

  const newCompanyAccount = {
    id: accountID,
    accountBalance: CommonUtility.amountRoundingFunc({
      value: updatedAccountBalance,
    }),
    dateModified: dateModified,
  };

  const updatedCompanyAccountSet = {
    $set: newCompanyAccount,
  };

  const addedBalanceByCashObj = await CommonApisUtility.updateDataInSchemaUtil({
    schema: CompanyAccountsSchema,
    newDataObject: newCompanyAccount,
    updatedDataSet: updatedCompanyAccountSet,
    schemaName: "Company Account",
    dataID: accountID,
  });
  await AccountsHistoryUtility.addNewAccountHistoryUtil({
    req: {
      body: {
        transactionMedium: 3,
        transactionType: 1,
        transactionStatus: addedBalanceByCashObj?.status === "success" ? 1 : 2,
        transactionAmount: Number(accountBalance),
        availableBalance: CommonUtility.amountRoundingFunc({
          value: updatedAccountBalance,
        }),
        toAccountName: foundAccountByAccIDObj.data.accountName,
        toBankName: foundAccountByAccIDObj.data.bankName,
        toAccountNumber: foundAccountByAccIDObj.data.accountNumber,
      },
    },
  });
  return addedBalanceByCashObj;
};

module.exports.addAccountBalanceViaOrderUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Account id is required.",
      data: {},
    };
  }
  if (
    req?.body?.accountBalance === undefined ||
    req.body.accountBalance === null ||
    req.body.accountBalance === ""
  ) {
    return {
      status: "error",
      message: "Account balance is required.",
      data: {},
    };
  }
  if (isNaN(req.body.accountBalance)) {
    return {
      status: "error",
      message: "Account balance must be a number.",
      data: {},
    };
  }

  const accountID = req.body.id;
  const accountBalance = req.body.accountBalance;
  const dateModified = new Date();

  const foundAccountByAccIDObj = await this.getCompanyAccountByAccountIDUtil({
    req: {
      body: {
        id: accountID,
      },
    },
  });
  if (foundAccountByAccIDObj?.status === "error") {
    return foundAccountByAccIDObj;
  }

  const updatedAccountBalance =
    Number(accountBalance) + Number(foundAccountByAccIDObj.data.accountBalance);

  const newCompanyAccount = {
    id: accountID,
    accountBalance: CommonUtility.amountRoundingFunc({
      value: updatedAccountBalance,
    }),
    dateModified: dateModified,
  };

  const updatedCompanyAccountSet = {
    $set: newCompanyAccount,
  };

  const addedBalanceByOrderObj = await CommonApisUtility.updateDataInSchemaUtil(
    {
      schema: CompanyAccountsSchema,
      newDataObject: newCompanyAccount,
      updatedDataSet: updatedCompanyAccountSet,
      schemaName: "Company Account",
      dataID: accountID,
    }
  );

  await AccountsHistoryUtility.addNewAccountHistoryUtil({
    req: {
      body: {
        transactionMedium:
          req?.body?.cardType?.toLowerCase() === "credit card" ? 1 : 2,
        transactionType: 1,
        transactionStatus: addedBalanceByOrderObj?.status === "success" ? 1 : 2,
        transactionAmount: Number(accountBalance),
        availableBalance: CommonUtility.amountRoundingFunc({
          value: updatedAccountBalance,
        }),
        toAccountName: foundAccountByAccIDObj.data.accountName,
        toBankName: foundAccountByAccIDObj.data.bankName,
        toAccountNumber: foundAccountByAccIDObj.data.accountNumber,
        fromAccountName: req?.body?.fromAccountName,
        fromBankName: req?.body?.fromBankName,
        fromAccountNumber: req?.body?.fromAccountNumber,
        expiryMonth: req?.body?.expiryMonth,
        expiryYear: req?.body?.expiryYear,
        cvv: req?.body?.cvv,
      },
    },
  });
  return addedBalanceByOrderObj;
};

module.exports.transferBalanceToAnotherAccountUtil = async ({ req }) => {
  if (
    !req?.body?.transferFromAccountNumber ||
    req.body.transferFromAccountNumber === ""
  ) {
    return {
      status: "error",
      message: "Transfer from account number is required.",
      data: {},
    };
  }
  if (
    !req?.body?.transferToAccountNumber ||
    req.body.transferToAccountNumber === ""
  ) {
    return {
      status: "error",
      message: "Transfer to account number is required.",
      data: {},
    };
  }
  if (!req?.body?.balanceToTransfer || req.body.balanceToTransfer === "") {
    return {
      status: "error",
      message: "Balance to transfer is required.",
      data: {},
    };
  }
  if (isNaN(req.body.balanceToTransfer)) {
    return {
      status: "error",
      message: "Balance to transfer must be a number.",
      data: {},
    };
  }
  const balanceToTransfer = Number(req.body.balanceToTransfer);
  if (balanceToTransfer < 1) {
    return {
      status: "error",
      message: "Balance to transfer must non-zero.",
      data: {},
    };
  }

  const transferFromAccountNumber = req.body.transferFromAccountNumber;
  const transferToAccountNumber = req.body.transferToAccountNumber;
  if (transferFromAccountNumber === transferToAccountNumber) {
    return {
      status: "error",
      message: `You cannot transfer balance to same account. From account ${transferFromAccountNumber} is same as To account ${transferToAccountNumber}`,
      data: {},
    };
  }

  const transferFromAccountDataObj =
    await this.getCompanyAccountByAccountNumberUtil({
      req: {
        body: {
          accountNumber: transferFromAccountNumber,
        },
      },
    });
  if (transferFromAccountDataObj?.status === "error") {
    return transferFromAccountDataObj;
  }
  const balanceFromTransfer = transferFromAccountDataObj?.data?.accountBalance
    ? Number(transferFromAccountDataObj.data.accountBalance)
    : 0;
  if (balanceFromTransfer < balanceToTransfer) {
    return {
      status: "error",
      message: `Account with account number ${transferFromAccountNumber} doesn't have enough balance to transfer to account with account number ${transferToAccountNumber}`,
      data: {},
    };
  }

  const transferToAccountDataObj =
    await this.getCompanyAccountByAccountNumberUtil({
      req: {
        body: {
          accountNumber: transferToAccountNumber,
        },
      },
    });
  if (transferToAccountDataObj?.status === "error") {
    return transferToAccountDataObj;
  }
  const currentBalanceToTransfer = transferToAccountDataObj?.data
    ?.accountBalance
    ? Number(transferToAccountDataObj.data.accountBalance)
    : 0;

  const transferFromAccountID = transferFromAccountDataObj.data.id;
  const transferToAccountID = transferToAccountDataObj.data.id;

  const updatedTransferFromAccountDataObj = {
    id: transferFromAccountID,
    accountBalance: CommonUtility.amountRoundingFunc({
      value: balanceFromTransfer - balanceToTransfer,
    }),
    dateModified: new Date(),
  };

  const updatedTransferFromAccountSet = {
    $set: updatedTransferFromAccountDataObj,
  };

  const updatedFromAccountDataObj =
    await CommonApisUtility.updateDataInSchemaUtil({
      schema: CompanyAccountsSchema,
      newDataObject: updatedTransferFromAccountDataObj,
      updatedDataSet: updatedTransferFromAccountSet,
      schemaName: "Company Account",
      dataID: transferFromAccountID,
    });

  await AccountsHistoryUtility.addNewAccountHistoryUtil({
    req: {
      body: {
        transactionMedium: 4,
        transactionType: 2,
        transactionStatus:
          updatedFromAccountDataObj?.status === "success" ? 1 : 2,
        transactionAmount: Number(balanceToTransfer),
        availableBalance: CommonUtility.amountRoundingFunc({
          value: balanceFromTransfer - balanceToTransfer,
        }),
        toAccountName: transferToAccountDataObj.data.accountName,
        toBankName: transferToAccountDataObj.data.bankName,
        toAccountNumber: transferToAccountDataObj.data.accountNumber,
        fromAccountName: transferFromAccountDataObj.data.accountName,
        fromBankName: transferFromAccountDataObj.data.bankName,
        fromAccountNumber: transferFromAccountDataObj.data.accountNumber,
      },
    },
  });

  const updatedTransferToAccountDataObj = {
    id: transferToAccountID,
    accountBalance: CommonUtility.amountRoundingFunc({
      value: currentBalanceToTransfer + balanceToTransfer,
    }),
    dateModified: new Date(),
  };

  const updatedTransferToAccountSet = {
    $set: updatedTransferToAccountDataObj,
  };

  const updatedToAccountDataObj =
    await CommonApisUtility.updateDataInSchemaUtil({
      schema: CompanyAccountsSchema,
      newDataObject: updatedTransferToAccountSet,
      updatedDataSet: updatedTransferToAccountDataObj,
      schemaName: "Company Account",
      dataID: transferToAccountID,
    });

  await AccountsHistoryUtility.addNewAccountHistoryUtil({
    req: {
      body: {
        transactionMedium: 4,
        transactionType: 1,
        transactionStatus:
          updatedToAccountDataObj?.status === "success" ? 1 : 2,
        transactionAmount: Number(balanceToTransfer),
        availableBalance: CommonUtility.amountRoundingFunc({
          value: currentBalanceToTransfer + balanceToTransfer,
        }),
        toAccountName: transferToAccountDataObj.data.accountName,
        toBankName: transferToAccountDataObj.data.bankName,
        toAccountNumber: transferToAccountDataObj.data.accountNumber,
        fromAccountName: transferFromAccountDataObj.data.accountName,
        fromBankName: transferFromAccountDataObj.data.bankName,
        fromAccountNumber: transferFromAccountDataObj.data.accountNumber,
      },
    },
  });

  let message = `Balance is transferred successfully from account ${transferFromAccountNumber} to account ${transferToAccountNumber}`;
  let isBothSucceeded = true;
  let data = {
    transferFrom: updatedTransferFromAccountDataObj,
    transferTo: updatedTransferToAccountDataObj,
  };
  if (
    updatedFromAccountDataObj?.status === "error" &&
    updatedToAccountDataObj?.status === "success"
  ) {
    message = `Balance is not transferred from account ${transferFromAccountNumber} to account ${transferToAccountNumber}. ${
      updatedFromAccountDataObj?.message ?? ""
    }`;
  }
  if (
    updatedFromAccountDataObj?.status === "success" &&
    updatedToAccountDataObj?.status === "error"
  ) {
    message = `Balance is not transferred from account ${transferFromAccountNumber} to account ${transferToAccountNumber}. ${
      updatedToAccountDataObj?.message ?? ""
    }`;
  }

  return {
    status: isBothSucceeded ? "success" : "error",
    message: message,
    data: data,
  };
};

module.exports.emptyTheCompanyAccountBalanceUtil = async ({ req }) => {
  if (!req?.body?.id || req.body.id === "") {
    return {
      status: "error",
      message: "Account id is required.",
      data: {},
    };
  }

  const accountID = req.body.id;
  const accountBalance = 0;
  const dateModified = new Date();

  const foundAccountByAccIDObj = await this.getCompanyAccountByAccountIDUtil({
    req: {
      body: {
        id: accountID,
      },
    },
  });
  if (foundAccountByAccIDObj?.status === "error") {
    return foundAccountByAccIDObj;
  }

  const newCompanyAccount = {
    id: accountID,
    accountBalance: CommonUtility.amountRoundingFunc({
      value: accountBalance,
    }),
    dateModified: dateModified,
  };

  const updatedCompanyAccountSet = {
    $set: newCompanyAccount,
  };

  return await CommonApisUtility.updateDataInSchemaUtil({
    schema: CompanyAccountsSchema,
    newDataObject: newCompanyAccount,
    updatedDataSet: updatedCompanyAccountSet,
    schemaName: "Company Account",
    dataID: accountID,
  });
};
