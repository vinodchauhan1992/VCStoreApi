const ClientBannersUtility = require("../../utilities/v3/clientBannersUtility");

module.exports.getAllClientBanners = async (req, res) => {
  const foundClientBannerObject =
    await ClientBannersUtility.getAllClientBannersUtil({
      req,
    });
  res.json(foundClientBannerObject);
};

module.exports.getClientBannerByID = async (req, res) => {
  const foundClientBannerObject =
    await ClientBannersUtility.getClientBannerByIDUtil({
      req,
    });
  res.json(foundClientBannerObject);
};

module.exports.addClientBanner = async (req, res) => {
  const foundClientBannerObject = await ClientBannersUtility.addClientBannerUtil({
    req,
  });
  res.json(foundClientBannerObject);
};

module.exports.updateClientBanner = async (req, res) => {
  const foundClientBannerObject = await ClientBannersUtility.updateClientBannerUtil(
    {
      req,
    }
  );
  res.json(foundClientBannerObject);
};

module.exports.deleteClientBanner = async (req, res) => {
  const foundClientBannerObject = await ClientBannersUtility.deleteClientBannerUtil(
    {
      req,
    }
  );
  res.json(foundClientBannerObject);
};
