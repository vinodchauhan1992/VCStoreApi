const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");
const CustomersLoginUtility = require("./customersLoginUtility");
const AppIdsUtility = require("./appIdsUtility");
const ClientRouteUtitlity = require("./clientRouteUtitlity");

module.exports.getStaticImagesUtil = async () => {
  const staticImages = {
    companyLogo: {
      logoDark: {
        ext: "svg",
        url: "https://firebasestorage.googleapis.com/v0/b/vcstore-10e65.appspot.com/o/images%2FmiscImages%2Fcompany-logo-dark.svg?alt=media&token=3778938d-3f12-4494-8d8b-5e9c7df5efd8",
      },
      logoWhite: {
        ext: "svg",
        url: "https://firebasestorage.googleapis.com/v0/b/vcstore-10e65.appspot.com/o/images%2FmiscImages%2Fcompany-logo-white.svg?alt=media&token=6dd09ae7-ddd7-4a35-b10e-4d432c95a369",
      },
    },
  };

  return {
    status: "success",
    message: "Static images fetched successfully.",
    data: staticImages,
  };
};

module.exports.getFooterSectionAccountSectionArrUtil = () => {
  const accountSectionArr = [
    {
      id: "fs_as_1",
      label: "My Account",
      url: ClientRouteUtitlity.utils.MY_PROFILE_SCREEN_ROUTE,
    },
    {
      id: "fs_as_2",
      label: "Login/Register",
      url: ClientRouteUtitlity.utils.LANDING_SCREEN_ROUTE,
    },
    {
      id: "fs_as_3",
      label: "Cart",
      url: ClientRouteUtitlity.utils.CART_SCREEN_ROUTE,
    },
    {
      id: "fs_as_4",
      label: "Wishlist",
      url: ClientRouteUtitlity.utils.WISHLIST_SCREEN_ROUTE,
    },
  ];

  return accountSectionArr;
};

module.exports.getFooterSectionQuickLinkSectionArrUtil = () => {
  const accountSectionArr = [
    {
      id: "fs_qls_1",
      label: "Privacy Policy",
      url: ClientRouteUtitlity.utils.PRIVACY_POLICY_SCREEN_ROUTE,
    },
    {
      id: "fs_qls_2",
      label: "Terms of Use",
      url: ClientRouteUtitlity.utils.TERMS_OF_USE_SCREEN_ROUTE,
    },
    {
      id: "fs_qls_3",
      label: "FAQ",
      url: ClientRouteUtitlity.utils.FAQ_SCREEN_ROUTE,
    },
    {
      id: "fs_qls_4",
      label: "About Us",
      url: ClientRouteUtitlity.utils.ABOUT_US_SCREEN_ROUTE,
    },
    {
      id: "fs_qls_5",
      label: "Contact Us",
      url: ClientRouteUtitlity.utils.CONTACT_US_SCREEN_ROUTE,
    },
  ];

  return accountSectionArr;
};

module.exports.getFooterSectionSupportDataUtil = () => {
  return {
    heading: "Support",
    address1: "Shop-14/15/16, MGF Mall, MG Road",
    address2: "Gurugram, Haryana, India",
    contact: "+91 9599780186",
  };
};

module.exports.getFooterSectionLogoDataUtil = async () => {
  const staticImagesData = await this.getStaticImagesUtil();
  return {
    logoData: staticImagesData.data.companyLogo,
    title: "Copyright VC Corporation 2022.",
  };
};

module.exports.getFooterSectionDataForLandingPageUtil = async () => {
  const footerSectionLogoData = await this.getFooterSectionLogoDataUtil();
  return {
    supportData: this.getFooterSectionSupportDataUtil(),
    listsData: [
      {
        header: "Quick Links",
        dataArr: this.getFooterSectionQuickLinkSectionArrUtil(),
      },
    ],
    footerSectionLogoData: footerSectionLogoData,
  };
};

module.exports.getFooterSectionDataForLoggedInHomePageUtil = async () => {
  const footerSectionLogoData = await this.getFooterSectionLogoDataUtil();
  return {
    supportData: this.getFooterSectionSupportDataUtil(),
    listsData: [
      {
        header: "Account",
        dataArr: this.getFooterSectionAccountSectionArrUtil(),
      },
      {
        header: "Quick Links",
        dataArr: this.getFooterSectionQuickLinkSectionArrUtil(),
      },
    ],
    footerSectionLogoData: footerSectionLogoData,
  };
};

module.exports.getFooterSectionDataUtil = async ({ req }) => {
  const jwtToken = req?.headers?.jwttoken ?? null;
  const appID = req?.headers?.app_id ?? null;
  if (!appID || appID === "") {
    return {
      status: "error",
      message: `App id is required in header.`,
      data: {},
    };
  }

  const foundAppIdObj = await AppIdsUtility.getAppIdByAppIdUtil({
    req: {
      body: {
        id: appID,
      },
    },
  });

  if (foundAppIdObj?.status === "error") {
    return {
      status: "error",
      message: `Invalid app id. send app id for client app.`,
      data: {},
    };
  }

  if (!jwtToken || jwtToken === "") {
    // Customer not logged in so send footer for landing page
    const data = await this.getFooterSectionDataForLandingPageUtil();
    return {
      status: "success",
      message: `Footer section data is fetched successfully.`,
      data: data,
    };
  }

  const foundLoginObj =
    await CustomersLoginUtility.getCustomerLoginByJwtTokenUtil({
      req: {
        body: {
          jwtToken: jwtToken,
        },
      },
    });

  if (foundLoginObj?.status === "error" || foundLoginObj?.data?.isLogout) {
    // Customer not logged in so send footer for landing page
    const data = await this.getFooterSectionDataForLandingPageUtil();
    return {
      status: "success",
      message: `Footer section data is fetched successfully.`,
      data: data,
    };
  }

  // Customer logged in so send footer for logged in home page
  const data = await this.getFooterSectionDataForLoggedInHomePageUtil();
  return {
    status: "success",
    message: `Footer section data is fetched successfully.`,
    data: data,
  };
};
