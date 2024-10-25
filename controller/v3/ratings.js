const RatingsUtility = require("../../utilities/v3/ratingsUtility");

module.exports.getAllRatings = async (req, res) => {
  const foundDataObj = await RatingsUtility.getAllRatingsUtil({ req });
  res.json(foundDataObj);
};

module.exports.getAllLikedRatings = async (req, res) => {
  const foundDataObj = await RatingsUtility.getAllLikedRatingsUtil({ req });
  res.json(foundDataObj);
};

module.exports.getAllDislikedRatings = async (req, res) => {
  const foundDataObj = await RatingsUtility.getAllDislikedRatingsUtil({ req });
  res.json(foundDataObj);
};

module.exports.getAllAbusedRatings = async (req, res) => {
  const foundDataObj = await RatingsUtility.getAllAbusedRatingsUtil({ req });
  res.json(foundDataObj);
};

module.exports.getRatingByRatingID = async (req, res) => {
  const foundDataObj = await RatingsUtility.getRatingByRatingIDUtil({ req });
  res.json(foundDataObj);
};

module.exports.getRatingsByCustomerID = async (req, res) => {
  const foundDataObj = await RatingsUtility.getRatingsByCustomerIDUtil({ req });
  res.json(foundDataObj);
};

module.exports.getRatingsByProductID = async (req, res) => {
  const foundDataObj = await RatingsUtility.getRatingsByProductIDUtil({ req });
  res.json(foundDataObj);
};

module.exports.addNewRating = async (req, res) => {
  const foundDataObj = await RatingsUtility.addNewRatingUtil({ req });
  res.json(foundDataObj);
};

module.exports.deleteRating = async (req, res) => {
  const foundDataObj = await RatingsUtility.deleteRatingUtil({ req });
  res.json(foundDataObj);
};

module.exports.updateLikeToRating = async (req, res) => {
  const foundDataObj = await RatingsUtility.updateLikeToRatingUtil({ req });
  res.json(foundDataObj);
};

module.exports.updateDislikeToRating = async (req, res) => {
  const foundDataObj = await RatingsUtility.updateDislikeToRatingUtil({ req });
  res.json(foundDataObj);
};

module.exports.updateAbuseReportedForRating = async (req, res) => {
  const foundDataObj = await RatingsUtility.updateAbuseReportedForRatingUtil({ req });
  res.json(foundDataObj);
};
