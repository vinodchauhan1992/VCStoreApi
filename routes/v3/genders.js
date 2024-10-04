const express = require("express");
const router = express.Router();
const genders = require("../../controller/v3/genders");

router.post("/allGenders", genders.getAllGenders);
router.post("/genderById", genders.getGenderById);
router.post("/genderByGenderTitle", genders.getGenderByGenderTitle);
router.post("/genderByGenderCode", genders.getGenderByGenderCode);
router.post("/addNewGender", genders.addNewGender);
router.post("/updateGender", genders.updateGender);
router.post("/deleteGender", genders.deleteGender);

module.exports = router;
