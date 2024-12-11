const express = require("express");
const router = express.Router();
const accountsHistory = require("../../controller/v3/accountsHistory");

router.post("/allAccountsHistory", accountsHistory.getAllAccountsHistory);
router.post(
  "/accountHistoryByAccountHistoryID",
  accountsHistory.getAccountHistoryByAccountHistoryID
);
router.post(
  "/accountsHistoryByTransactionMedium",
  accountsHistory.getAccountsHistoryByTransactionMedium
);
router.post(
  "/accountsHistoryByTransactionStatus",
  accountsHistory.getAccountsHistoryByTransactionStatus
);
router.post(
  "/accountsHistoryByTransactionType",
  accountsHistory.getAccountsHistoryByTransactionType
);
router.post("/addNewAccountHistory", accountsHistory.addNewAccountHistory);
router.post(
  "/deleteAllAccountsHistory",
  accountsHistory.deleteAllAccountsHistory
);

module.exports = router;
