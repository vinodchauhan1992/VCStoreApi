const ClientLandingPageUtility = require("../../utilities/v3/clientLandingPageUtility");

module.exports.getClientLandingPageData = async (req, res) => {
  const foundItemObj =
    await ClientLandingPageUtility.getClientLandingPageDataUtil();
  res.json(foundItemObj);
};
