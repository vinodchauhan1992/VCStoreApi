const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");
const CustomersLoginUtility = require("./customersLoginUtility");
const AppIdsUtility = require("./appIdsUtility");
const ClientRouteUtility = require("./clientRouteUtility");
const ConstantsUtility = require("./constantsUtility");
const ClientLandingPageUtility = require("./clientLandingPageUtility");

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

module.exports.getFooterSectionAccountSectionArrUtil = ({ key }) => {
  const accountSectionArr = [
    {
      id: "fs_as_1",
      label: "My Account",
      url: ClientRouteUtility.utils.MY_PROFILE_SCREEN_ROUTE,
      key: key,
    },
    {
      id: "fs_as_2",
      label: "Login/Register",
      url: ClientRouteUtility.utils.LANDING_SCREEN_ROUTE,
      key: key,
    },
    {
      id: "fs_as_3",
      label: "Cart",
      url: ClientRouteUtility.utils.CART_SCREEN_ROUTE,
      key: key,
    },
    {
      id: "fs_as_4",
      label: "Wishlist",
      url: ClientRouteUtility.utils.WISHLIST_SCREEN_ROUTE,
      key: key,
    },
  ];

  return accountSectionArr;
};

module.exports.getFooterSectionQuickLinkSectionArrUtil = ({
  key,
  userLoggedIn,
}) => {
  const accountSectionArr = [
    {
      id: "fs_qls_1",
      label: "Privacy Policy",
      url: userLoggedIn
        ? ClientRouteUtility.utils.PRIVACY_POLICY_SCREEN_ROUTE
        : ClientRouteUtility.utils.LOGGED_OUT_PRIVACY_POLICY_SCREEN_ROUTE,
      key: key,
    },
    {
      id: "fs_qls_2",
      label: "Terms of Use",
      url: userLoggedIn
        ? ClientRouteUtility.utils.TERMS_OF_USE_SCREEN_ROUTE
        : ClientRouteUtility.utils.LOGGED_OUT_TERMS_OF_USE_SCREEN_ROUTE,
      key: key,
    },
    {
      id: "fs_qls_3",
      label: "FAQ",
      url: userLoggedIn
        ? ClientRouteUtility.utils.FAQ_SCREEN_ROUTE
        : ClientRouteUtility.utils.LOGGED_OUT_FAQ_SCREEN_ROUTE,
      key: key,
    },
    {
      id: "fs_qls_4",
      label: "About Us",
      url: userLoggedIn
        ? ClientRouteUtility.utils.ABOUT_US_SCREEN_ROUTE
        : ClientRouteUtility.utils.LOGGED_OUT_ABOUT_US_SCREEN_ROUTE,
      key: key,
    },
    {
      id: "fs_qls_5",
      label: "Contact Us",
      url: userLoggedIn
        ? ClientRouteUtility.utils.CONTACT_US_SCREEN_ROUTE
        : ClientRouteUtility.utils.LOGGED_OUT_CONTACT_US_SCREEN_ROUTE,
      key: key,
    },
  ];

  return accountSectionArr;
};

module.exports.getFooterSectionSupportDataUtil = () => {
  const { ADDRESS_1, ADDRESS_2, CITY, STATE, COUNTRY, PHONE } =
    ConstantsUtility.utils.COMPANY_HQ_ADDR;
  return {
    heading: "Support",
    address1: `${ADDRESS_1}`,
    address2: `${ADDRESS_2}, ${CITY}, ${STATE}, ${COUNTRY}`,
    contact: `${PHONE}`,
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
        dataArr: this.getFooterSectionQuickLinkSectionArrUtil({
          key: ConstantsUtility.utils.ENUMS.FOOTER_LANDING_QUICK_LINK_SECTION,
          userLoggedIn: false,
        }),
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
        dataArr: this.getFooterSectionAccountSectionArrUtil({
          key: ConstantsUtility.utils.ENUMS.FOOTER_LOGGEDIN_ACCOUNT_SECTION,
        }),
      },
      {
        header: "Quick Links",
        dataArr: this.getFooterSectionQuickLinkSectionArrUtil({
          key: ConstantsUtility.utils.ENUMS.FOOTER_LOGGEDIN_QUICK_LINK_SECTION,
          userLoggedIn: true,
        }),
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

module.exports.getContactUsDataUtil = async ({ req }) => {
  const { ADDRESS_1, ADDRESS_2, CITY, STATE, COUNTRY, PHONE } =
    ConstantsUtility.utils.COMPANY_HQ_ADDR;
  const contactUsData = {
    heading: "Let's Connect!",
    description:
      "Your thoughts, questions, and feedback are what help us grow and improve Teak. Whether you've encountered an issue, have a suggestion, or just want to share your experience, we're here to listen. Reach out to us using the form below or through any of the other contact methods provided. Let's make your bookmarking experience even better, together.",
    contactData: {
      companyEmail: `${ConstantsUtility.utils.COMPANY_EMAIL}`,
      companyPhone: `${PHONE}`,
      companyAddress: `${ADDRESS_1}, ${ADDRESS_2}, ${CITY}, ${STATE}, ${COUNTRY}`,
    },
  };

  return contactUsData;
};

module.exports.getClientMiscDataUtil = async ({ req }) => {
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

  const footerObj = await this.getFooterSectionDataUtil({ req });
  const contactUsData = await this.getContactUsDataUtil({ req });
  const landingPageData =
    await ClientLandingPageUtility.getClientLandingPageDataUtil();

  return {
    status: "success",
    message: `Footer section data is fetched successfully.`,
    data: {
      landingPage: landingPageData?.data ?? null,
      footerSection: {
        data: footerObj?.data ?? null,
      },
      contactUsData: contactUsData,
    },
  };
};
