const express = require("express");
const router = express.Router();
const cities = require("../../controller/v2/cities");

router.get("/allCities", cities.getAllCities);
router.get("/cityByID/:cityID", cities.getCityById);
router.post("/addNewCity", cities.addCity);
router.put("/updateCity/:cityID", cities.updateCity);
router.delete("/deleteCity/:cityID", cities.deleteCity);
router.get("/citiesByStateID/:stateID", cities.getCitiesByStateId);
router.get("/citiesByCountryID/:countryID", cities.getCitiesByCountryId);

module.exports = router;
