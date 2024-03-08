const express = require("express");
const router = express.Router();
const adminSubmenu = require("../../controller/v2/adminSubmenu");

router.get("/allAdminSubmenus", adminSubmenu.getAllAdminSubmenus);
router.get("/adminMenuByID/:adminSubmenuID", adminSubmenu.getAdminSubmenuByID);
router.post("/addNewAdminSubmenu", adminSubmenu.addNewAdminSubmenu);
router.put("/updateAdminSubmenu/:adminSubmenuID", adminSubmenu.updateAdminSubmenu);
router.delete("/deleteAdminSubmenu/:adminSubmenuID", adminSubmenu.deleteAdminSubmenu);
router.patch(
  "/updateAdminSubmenuStatus/:adminSubmenuID",
  adminSubmenu.updateAdminSubmenuStatus
);
router.patch(
  "/updateAdminSubmenuDeleteableFlag/:adminSubmenuID",
  adminSubmenu.updateAdminSubmenuDeleteableFlag
);

module.exports = router;
