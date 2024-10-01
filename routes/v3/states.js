const express = require("express");
const router = express.Router();
const states = require("../../controller/v3/states");

router.post("/allStates", states.getAllStates);
router.post("/stateByID", states.getStateById);
router.post("/addNewState", states.addState);
router.post("/updateState", states.updateState);
router.post("/deleteState", states.deleteState);
router.post("/statesByCountryID", states.getStatesByCountryId);

module.exports = router;
