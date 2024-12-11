const CompanyAccountsUtility = require("../../utilities/v3/companyAccountsUtility");

module.exports.getAllCompanyAccounts = async (req, res) => {
  const foundItemObj = await CompanyAccountsUtility.getAllCompanyAccountsUtil({
    req: req,
  });
  res.json(foundItemObj);
};

module.exports.getCompanyAccountByAccountID = async (req, res) => {
  const foundItemObj =
    await CompanyAccountsUtility.getCompanyAccountByAccountIDUtil({ req: req });
  res.json(foundItemObj);
};

module.exports.getCompanyAccountsByBankName = async (req, res) => {
  const foundItemObj =
    await CompanyAccountsUtility.getCompanyAccountsByBankNameUtil({ req: req });
  res.json(foundItemObj);
};

module.exports.getCompanyAccountByAccountNickname = async (req, res) => {
  const foundItemObj =
    await CompanyAccountsUtility.getCompanyAccountByAccountNicknameUtil({
      req: req,
    });
  res.json(foundItemObj);
};

module.exports.getCompanyAccountByAccountNumber = async (req, res) => {
  const foundItemObj =
    await CompanyAccountsUtility.getCompanyAccountByAccountNumberUtil({
      req: req,
    });
  res.json(foundItemObj);
};

module.exports.addNewCompanyAccount = async (req, res) => {
  const foundItemObj = await CompanyAccountsUtility.addNewCompanyAccountUtil({
    req: req,
  });
  res.json(foundItemObj);
};

module.exports.deleteCompanyAccount = async (req, res) => {
  const foundItemObj = await CompanyAccountsUtility.deleteCompanyAccountUtil({
    req: req,
  });
  res.json(foundItemObj);
};

module.exports.updateCompanyAccountBasicDetails = async (req, res) => {
  const foundItemObj =
    await CompanyAccountsUtility.updateCompanyAccountBasicDetailsUtil({
      req: req,
    });
  res.json(foundItemObj);
};

module.exports.addAccountBalanceViaCash = async (req, res) => {
  const foundItemObj =
    await CompanyAccountsUtility.addAccountBalanceViaCashUtil({
      req: req,
    });
  res.json(foundItemObj);
};

module.exports.emptyTheCompanyAccountBalance = async (req, res) => {
  const foundItemObj =
    await CompanyAccountsUtility.emptyTheCompanyAccountBalanceUtil({
      req: req,
    });
  res.json(foundItemObj);
};

module.exports.transferBalanceToAnotherAccount = async (req, res) => {
  const foundItemObj =
    await CompanyAccountsUtility.transferBalanceToAnotherAccountUtil({
      req: req,
    });
  res.json(foundItemObj);
};
