const express = require("express");
const router = express.Router();
const companyAccounts = require("../../controller/v3/companyAccounts");

router.post("/allCompanyAccounts", companyAccounts.getAllCompanyAccounts);
router.post(
  "/companyAccountByAccountID",
  companyAccounts.getCompanyAccountByAccountID
);
router.post(
  "/companyAccountByAccountNumber",
  companyAccounts.getCompanyAccountByAccountNumber
);
router.post(
  "/companyAccountsByBankName",
  companyAccounts.getCompanyAccountsByBankName
);
router.post(
  "/companyAccountByAccountNickname",
  companyAccounts.getCompanyAccountByAccountNickname
);
router.post("/addNewCompanyAccount", companyAccounts.addNewCompanyAccount);
router.post(
  "/updateAccountBasicDetails",
  companyAccounts.updateCompanyAccountBasicDetails
);
router.post(
  "/addAccountBalanceViaCash",
  companyAccounts.addAccountBalanceViaCash
);
router.post(
  "/emptyTheAccountBalance",
  companyAccounts.emptyTheCompanyAccountBalance
);
router.post("/deleteCompanyAccount", companyAccounts.deleteCompanyAccount);
router.post(
  "/transferBalanceToAnotherAccount",
  companyAccounts.transferBalanceToAnotherAccount
);

module.exports = router;
