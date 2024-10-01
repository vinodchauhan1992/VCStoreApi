const express = require("express");
const router = express.Router();
const cities = require("../../controller/v3/cities");

router.post("/allCities", cities.getAllCities);
router.post("/cityByID", cities.getCityById);
router.post("/addNewCity", cities.addCity);
router.post("/updateCity", cities.updateCity);
router.post("/deleteCity", cities.deleteCity);
router.post("/citiesByStateID", cities.getCitiesByStateId);
router.post("/citiesByCountryID", cities.getCitiesByCountryId);

module.exports = router;
