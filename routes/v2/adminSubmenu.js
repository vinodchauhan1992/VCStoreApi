const express = require("express");
const router = express.Router();
const adminSubmenu = require("../../controller/v2/adminSubmenu");

router.get("/allAdminSubmenus", adminSubmenu.getAllAdminSubmenus);
router.get("/submenuByID/:adminSubmenuID", adminSubmenu.getAdminSubmenuByID);
router.post("/addNewAdminSubmenu", adminSubmenu.addNewAdminSubmenu);
router.put(
  "/updateAdminSubmenu/:adminSubmenuID",
  adminSubmenu.updateAdminSubmenu
);
router.delete(
  "/deleteAdminSubmenu/:adminSubmenuID",
  adminSubmenu.deleteAdminSubmenu
);
router.put(
  "/updateAdminSubmenuStatus/:adminSubmenuID",
  adminSubmenu.updateAdminSubmenuStatus
);
router.put(
  "/updateAdminSubmenuDeleteableFlag/:adminSubmenuID",
  adminSubmenu.updateAdminSubmenuDeleteableFlag
);
router.get("/submenuByMenuID/:menuID", adminSubmenu.getAdminSubmenuByMenuID);
router.get(
  "/adminSubmenusHighestPriority",
  adminSubmenu.getAdminSubmenusHighestPriority
);

router.get(
  "/allSubmenusRegisteredPriorities",
  adminSubmenu.getAllSubmenusRegisteredPriorities
);
router.get("/submenuByPriority/:priority", adminSubmenu.getSubmenuByPriority);
router.put(
  "/updateSubmenuPriority/:adminSubmenuID",
  adminSubmenu.updateSubmenuPriority
);

module.exports = router;
