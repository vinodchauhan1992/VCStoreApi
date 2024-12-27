const CommonUtility = require("./commonUtility");
const CommonApisUtility = require("./commonApisUtility");
const CustomersLoginUtility = require("./customersLoginUtility");
const AppIdsUtility = require("./appIdsUtility");
const ClientBannersUtility = require("./clientBannersUtility");
const CategoriesUtility = require("./categoriesUtility");
const BrandsUtility = require("./brandsUtility");
const ClientMiscUtility = require("./clientMiscUtility");
const ClientRouteUtility = require("./clientRouteUtility");
const ConstantsUtility = require("./constantsUtility");

module.exports.getTopHeaderLogoDataUtil = async ({ req }) => {
  const foundObj = await ClientMiscUtility.getStaticImagesUtil();
  return {
    logo: foundObj?.data?.companyLogo,
    title: "VC Store",
  };
};

module.exports.getTopHeaderMenuDataArrUtil = async ({ req }) => {
  return [
    {
      id: "app_top_bar_menu_item_1",
      label: "Home",
      url: ClientRouteUtility.utils.HOME_SCREEN_ROUTE,
      key: ConstantsUtility.utils.ENUMS.TOPBAR_MENU,
    },
    {
      id: "app_top_bar_menu_item_2",
      label: "Contact Us",
      url: ClientRouteUtility.utils.CONTACT_US_SCREEN_ROUTE,
      key: ConstantsUtility.utils.ENUMS.TOPBAR_MENU,
    },
    {
      id: "app_top_bar_menu_item_3",
      label: "About Us",
      url: ClientRouteUtility.utils.ABOUT_US_SCREEN_ROUTE,
      key: ConstantsUtility.utils.ENUMS.TOPBAR_MENU,
    },
  ];
};

module.exports.getTopHeaderDataUtil = async ({ req }) => {
  const topHeaderLogoData = await this.getTopHeaderLogoDataUtil({ req });
  const topHeaderMenuDataArr = await this.getTopHeaderMenuDataArrUtil({ req });

  return {
    topHeaderSectionLogoData: topHeaderLogoData,
    topHeaderMenuData: {
      dataArr: topHeaderMenuDataArr,
    },
  };
};

module.exports.getClientBannersArrUtil = async ({ req }) => {
  const foundDataObj = await ClientBannersUtility.getAllClientBannersUtil({
    req,
  });

  return foundDataObj?.data ?? [];
};

module.exports.getCategoriesArrUtil = async ({ req }) => {
  const foundDataObj = await CategoriesUtility.getAllProductCategoriesUtil({
    req,
  });

  return foundDataObj?.data ?? [];
};

module.exports.getBrandsArrUtil = async ({ req }) => {
  const foundDataObj = await BrandsUtility.getAllBrandsUtil({
    req,
  });

  return foundDataObj?.data ?? [];
};

module.exports.getFooterObjUtil = async ({ req }) => {
  const foundDataObj = await ClientMiscUtility.getFooterSectionDataUtil({
    req,
  });

  return foundDataObj?.data ?? {};
};

module.exports.getAllDataUtil = async ({ req }) => {
  const topHeaderDataObj = await this.getTopHeaderDataUtil({ req });
  const clientBannersArr = await this.getClientBannersArrUtil({ req });
  const categoriesArr = await this.getCategoriesArrUtil({ req });
  const brandsArr = await this.getBrandsArrUtil({ req });
  const footerObj = await this.getFooterObjUtil({ req });
  return {
    topHeaderData: {
      ...topHeaderDataObj,
    },
    clientBannersData: {
      dataArr: clientBannersArr,
    },
    categoriesData: {
      caption: "Categories",
      header: "Browse By Category",
      dataArr: categoriesArr,
    },
    brandsData: {
      caption: "Brands",
      header: "Browse By Brand",
      dataArr: brandsArr,
    },
    footerData: {
      data: footerObj,
    },
  };
};

module.exports.getClientHomePageDataUtil = async ({ req }) => {
  const jwtToken = req?.headers?.jwttoken ?? null;
  const appID = req?.headers?.app_id ?? null;
  if (!jwtToken || jwtToken === "") {
    return {
      status: "error",
      message: `Jwt token is required in header.`,
      data: {},
    };
  }
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

  const foundLoginObj =
    await CustomersLoginUtility.getCustomerLoginByJwtTokenUtil({
      req: {
        body: {
          jwtToken: jwtToken,
        },
      },
    });

  if (foundLoginObj?.status === "error") {
    return {
      status: "error",
      message: `You are not logged in to view home page.`,
      data: {},
    };
  }

  if (foundLoginObj?.data?.isLogout) {
    return {
      status: "error",
      message: `You are not logged in to view home page.`,
      data: {},
    };
  }

  const foundData = await this.getAllDataUtil({ req });

  return {
    status: "success",
    message: `Home page data is fetched successfully.`,
    data: foundData,
  };
};
