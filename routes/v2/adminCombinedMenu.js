const express = require("express");
const router = express.Router();
const adminCombinedMenu = require("../../controller/v2/adminCombinedMenu");

router.get(
  "/allAdminCombinedMenus",
  adminCombinedMenu.getAllAdminCombinedMenus
);
router.get(
  "/adminCombinedMenuByID/:adminMenuID",
  adminCombinedMenu.getAdminCombinedMenuByID
);

module.exports = router;
