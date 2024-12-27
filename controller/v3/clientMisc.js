const ClientMiscUtility = require("../../utilities/v3/clientMiscUtility");

module.exports.getFooterSectionData = async (req, res) => {
  const foundFaqObj = await ClientMiscUtility.getFooterSectionDataUtil({ req });
  res.json(foundFaqObj);
};

module.exports.getStaticImages = async (req, res) => {
  const foundFaqObj = await ClientMiscUtility.getStaticImagesUtil({ req });
  res.json(foundFaqObj);
};

module.exports.getClientMiscData = async (req, res) => {
  const foundFaqObj = await ClientMiscUtility.getClientMiscDataUtil({ req });
  res.json(foundFaqObj);
};
