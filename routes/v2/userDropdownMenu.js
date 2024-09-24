const express = require("express");
const router = express.Router();
const userDropdownMenu = require("../../controller/v2/userDropdownMenu");

router.get(
  "/allUserDropdownMenus",
  userDropdownMenu.getAllUserDropdownMenus
);
router.get(
  "/userDropdownMenuByID/:userDropdownMenuID",
  userDropdownMenu.getUserDropdownMenuById
);
router.post(
  "/addNewUserDropdownMenu",
  userDropdownMenu.addUserDropdownMenu
);
router.put(
  "/updateUserDropdownMenu/:userDropdownMenuID",
  userDropdownMenu.updateUserDropdownMenu
);
router.delete(
  "/deleteUserDropdownMenu/:userDropdownMenuID",
  userDropdownMenu.deleteUserDropdownMenu
);
router.get(
  "/userDropdownMenusHighestPriority",
  userDropdownMenu.getUserDropdownMenusHighestPriority
);
router.get(
  "/allUserDropdownMenusRegisteredPriorities",
  userDropdownMenu.getAllUserDropdownMenusRegisteredPriorities
);
router.get(
  "/userDropdownMenuByPriority/:priority",
  userDropdownMenu.getUserDropdownMenuByPriority
);

module.exports = router;
