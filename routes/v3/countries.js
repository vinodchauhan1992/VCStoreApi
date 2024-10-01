const express = require("express");
const router = express.Router();
const countries = require("../../controller/v3/countries");

router.post("/allCountries", countries.getAllCountries);
router.post("/countryByID", countries.getCountryById);
router.post("/addNewCountry", countries.addCountry);
router.post("/updateCountry", countries.updateCountry);
router.post("/deleteCountry", countries.deleteCountry);

module.exports = router;
