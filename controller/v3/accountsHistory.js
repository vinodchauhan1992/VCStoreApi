const AccountsHistoryUtility = require("../../utilities/v3/accountsHistoryUtility");

module.exports.getAllAccountsHistory = async (req, res) => {
  const foundItemObj = await AccountsHistoryUtility.getAllAccountsHistoryUtil({
    req: req,
  });
  res.json(foundItemObj);
};

module.exports.getAccountHistoryByAccountHistoryID = async (req, res) => {
  const foundItemObj =
    await AccountsHistoryUtility.getAccountHistoryByAccountHistoryIDUtil({
      req: req,
    });
  res.json(foundItemObj);
};

module.exports.getAccountsHistoryByTransactionMedium = async (req, res) => {
  const foundItemObj =
    await AccountsHistoryUtility.getAccountsHistoryByTransactionMediumUtil({
      req: req,
    });
  res.json(foundItemObj);
};

module.exports.getAccountsHistoryByTransactionType = async (req, res) => {
  const foundItemObj =
    await AccountsHistoryUtility.getAccountsHistoryByTransactionTypeUtil({
      req: req,
    });
  res.json(foundItemObj);
};

module.exports.getAccountsHistoryByTransactionStatus = async (req, res) => {
  const foundItemObj =
    await AccountsHistoryUtility.getAccountsHistoryByTransactionStatusUtil({
      req: req,
    });
  res.json(foundItemObj);
};

module.exports.addNewAccountHistory = async (req, res) => {
  const foundItemObj = await AccountsHistoryUtility.addNewAccountHistoryUtil({
    req: req,
  });
  res.json(foundItemObj);
};

module.exports.deleteAllAccountsHistory = async (req, res) => {
  const foundItemObj =
    await AccountsHistoryUtility.deleteAllAccountsHistoryUtil({
      req: req,
    });
  res.json(foundItemObj);
};
