const ClientHomePageUtility = require("../../utilities/v3/clientHomePageUtility");

module.exports.getClientHomePageData = async (req, res) => {
  const foundItemObj = await ClientHomePageUtility.getClientHomePageDataUtil({
    req,
  });
  res.json(foundItemObj);
};
