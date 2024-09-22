const express = require("express");
const router = express.Router();
const states = require("../../controller/v2/states");

router.get("/allStates", states.getAllStates);
router.get("/stateByID/:stateID", states.getStateById);
router.post("/addNewState", states.addState);
router.put("/updateState/:stateID", states.updateState);
router.delete("/deleteState/:stateID", states.deleteState);
router.get("/statesByCountryID/:countryID", states.getStatesByCountryId);

module.exports = router;
