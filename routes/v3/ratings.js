const express = require("express");
const router = express.Router();
const ratings = require("../../controller/v3/ratings");

router.post("/allRatings", ratings.getAllRatings);
router.post("/ratingByRatingID", ratings.getRatingByRatingID);
router.post("/ratingsByCustomerID", ratings.getRatingsByCustomerID);
router.post("/ratingsByProductID", ratings.getRatingsByProductID);
router.post("/allLikedRatings", ratings.getAllLikedRatings);
router.post("/allDislikedRatings", ratings.getAllDislikedRatings);
router.post("/allAbusedRatings", ratings.getAllAbusedRatings);
router.post("/addNewRating", ratings.addNewRating);
router.post("/deleteRating", ratings.deleteRating);
router.post("/updateLikeToRating", ratings.updateLikeToRating);
router.post("/updateDislikeToRating", ratings.updateDislikeToRating);
router.post(
  "/updateAbuseReportedForRating",
  ratings.updateAbuseReportedForRating
);

module.exports = router;
