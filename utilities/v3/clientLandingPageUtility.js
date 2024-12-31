const ConstantsUtility = require("./constantsUtility");
const StaticImagesUtility = require("./staticImagesUtility");

module.exports.getLandingPageData = async () => {
  return {
    images: StaticImagesUtility.getStaticImagesUrls().landingScreenImages,
    title: ConstantsUtility.utils.COMPANY_HQ_ADDR.NAME,
    description:
      "Welcome to the Exclusive Store. You can buy any electronics items at best price.",
  };
};

module.exports.getClientLandingPageDataUtil = async () => {
  const landingPageData = await this.getLandingPageData();
  return {
    status: "success",
    message: `Client landing page data fetched successfully.`,
    data: landingPageData,
  };
};
