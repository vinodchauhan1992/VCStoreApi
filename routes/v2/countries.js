const express = require("express");
const router = express.Router();
const countries = require("../../controller/v2/countries");

router.get("/allCountries", countries.getAllCountries);
router.get("/countryByID/:countryID", countries.getCountryById);
router.post("/addNewCountry", countries.addCountry);
router.put("/updateCountry/:countryID", countries.updateCountry);
router.delete("/deleteCountry/:countryID", countries.deleteCountry);

module.exports = router;
