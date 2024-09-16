const express = require("express");
const router = express.Router();
const adminMenu = require("../../controller/v2/adminMenu");

router.get("/allAdminMenus", adminMenu.getAllAdminMenus);
router.get("/adminMenuByID/:adminMenuID", adminMenu.getAdminMenuByID);
router.post("/addNewAdminMenu", adminMenu.addNewAdminMenu);
router.put("/updateAdminMenu/:adminMenuID", adminMenu.updateAdminMenu);
router.delete("/deleteAdminMenu/:adminMenuID", adminMenu.deleteAdminMenu);
router.put(
  "/updateAdminMenuStatus/:adminMenuID",
  adminMenu.updateAdminMenuStatus
);
router.put(
  "/updateAdminMenuDeleteableFlag/:adminMenuID",
  adminMenu.updateAdminMenuDeleteableFlag
);
router.get(
  "/adminMenusHighestPriority",
  adminMenu.getAdminMenusHighestPriority
);
router.get(
  "/allMenusRegisteredPriorities",
  adminMenu.getAllMenusRegisteredPriorities
);
router.get("/adminMenuByPriority/:priority", adminMenu.getAdminMenuByPriority);
router.put("/updateMenuPriority/:adminMenuID", adminMenu.updateMenuPriority);

module.exports = router;
