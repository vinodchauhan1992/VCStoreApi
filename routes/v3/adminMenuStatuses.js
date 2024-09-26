const express = require("express");
const router = express.Router();
const adminMenuStatuses = require("../../controller/v3/adminMenuStatuses");

router.get("/allAdminMenuStatuses", adminMenuStatuses.getAllAdminMenuStatuses);
router.get(
  "/adminMenuStatusesByID/:adminMenuStatusesID",
  adminMenuStatuses.getAdminMenuStatusesByID
);
router.post(
  "/addNewAdminMenuStatuses",
  adminMenuStatuses.addNewAdminMenuStatuses
);
router.put(
  "/updateAdminMenuStatuses/:adminMenuStatusesID",
  adminMenuStatuses.updateAdminMenuStatuses
);
router.delete(
  "/deleteAdminMenuStatuses/:adminMenuStatusesID",
  adminMenuStatuses.deleteAdminMenuStatuses
);

module.exports = router;
