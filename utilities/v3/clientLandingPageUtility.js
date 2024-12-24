module.exports.getLandingPageTopHeaderMenuData = () => {
  const data = {
    menuDataArr: [
      {
        label: "Home",
        route: "#home",
      },
      {
        label: "Features",
        route: "#features",
      },
      {
        label: "Highlights",
        route: "#highlights",
      },
    ],
    buttonData: {
      label: "Login",
      route: "/auth/login",
      className:
        "border-none ml-5 font-light line-height-2 bg-bluegray-800 text-white",
    },
    logoData: {
      logoName: "company-logo",
      companyName: "VC Store",
      logoRoute: "/",
      companyNameWrapperClass:
        "text-900 font-medium text-2xl line-height-3 mr-8",
      logoLinkClass: "flex align-items-center",
      logoClass: "mr-0 lg:mr-2",
      logoHeight: "50",
    },
  };
  return data;
};

module.exports.getLandingPageHeroHeaderData = () => {
  const data = {
    textData: {
      title: "Online & Offline Store",
      subtitle: "For Electronics Items",
      description:
        "You can find a wide range of electronics items in VC Store. VC Store is available online as well as offline.",
    },
    btnData: {
      label: "Shop Now",
      route: "/auth/login",
      className:
        "text-xl border-none mt-3 bg-green-500 font-normal line-height-3 px-3 text-white",
    },
    heroImageData: {
      imageName: "landing-hero",
      imageClass: "w-9 md:w-auto",
      wrapperClass: "flex justify-content-center md:justify-content-end",
    },
  };
  return data;
};

module.exports.getLandingPageBodyContentCardsDataArr = () => {
  const cardsArr = [
    {
      title: "Easy to Find",
      description: "Find products easily.",
      topLeftIcon: "users",
      topLeftIconBgWrapperColor: "yellow-200",
      topLeftIconColor: "yellow-700",
      topLeftIconBgWrapperWidth: "3.5rem",
      topLeftIconBgWrapperHeight: "3.5rem",
      topLeftIconBgWrapperBorderRadius: "10px",
      cardBgColor: "surface-card",
      cardBorderRadius: "8px",
      cardWrapper2Bg:
        "linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))",
      mainWrapperClassName:
        "col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0",
    },
    {
      title: "New Products",
      description: "All products are new.",
      topLeftIcon: "palette",
      topLeftIconBgWrapperColor: "cyan-200",
      topLeftIconColor: "cyan-700",
      topLeftIconBgWrapperWidth: "3.5rem",
      topLeftIconBgWrapperHeight: "3.5rem",
      topLeftIconBgWrapperBorderRadius: "10px",
      cardBgColor: "surface-card",
      cardBorderRadius: "8px",
      cardWrapper2Bg:
        "linear-gradient(90deg, rgba(145,226,237,0.2),rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))",
      mainWrapperClassName:
        "col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0",
    },
    {
      title: "Well Descriptive",
      description: "Products are well described.",
      topLeftIcon: "map",
      topLeftIconBgWrapperColor: "indigo-200",
      topLeftIconColor: "indigo-700",
      topLeftIconBgWrapperWidth: "3.5rem",
      topLeftIconBgWrapperHeight: "3.5rem",
      topLeftIconBgWrapperBorderRadius: "10px",
      cardBgColor: "surface-card",
      cardBorderRadius: "8px",
      cardWrapper2Bg:
        "linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))",
      mainWrapperClassName:
        "col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0",
    },
    {
      title: "Available Offline",
      description: "You can visit store physically.",
      topLeftIcon: "id-card",
      topLeftIconBgWrapperColor: "bluegray-200",
      topLeftIconColor: "bluegray-700",
      topLeftIconBgWrapperWidth: "3.5rem",
      topLeftIconBgWrapperHeight: "3.5rem",
      topLeftIconBgWrapperBorderRadius: "10px",
      cardBgColor: "surface-card",
      cardBorderRadius: "8px",
      cardWrapper2Bg:
        "linear-gradient(90deg, rgba(187, 199, 205, 0.2),rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2),rgba(145, 210, 204, 0.2))",
      mainWrapperClassName:
        "col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0",
    },
    {
      title: "Clean Stores",
      description: "Stores are clean & hygeinic.",
      topLeftIcon: "star",
      topLeftIconBgWrapperColor: "orange-200",
      topLeftIconColor: "orange-700",
      topLeftIconBgWrapperWidth: "3.5rem",
      topLeftIconBgWrapperHeight: "3.5rem",
      topLeftIconBgWrapperBorderRadius: "10px",
      cardBgColor: "surface-card",
      cardBorderRadius: "8px",
      cardWrapper2Bg:
        "linear-gradient(90deg, rgba(187, 199, 205, 0.2),rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(145, 226, 237, 0.2),rgba(160, 210, 250, 0.2))",
      mainWrapperClassName:
        "col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0",
    },
    {
      title: "Payment Modes",
      description: "Online payment modes.",
      topLeftIcon: "moon",
      topLeftIconBgWrapperColor: "pink-200",
      topLeftIconColor: "pink-700",
      topLeftIconBgWrapperWidth: "3.5rem",
      topLeftIconBgWrapperHeight: "3.5rem",
      topLeftIconBgWrapperBorderRadius: "10px",
      cardBgColor: "surface-card",
      cardBorderRadius: "8px",
      cardWrapper2Bg:
        "linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(212, 162, 221, 0.2))",
      mainWrapperClassName:
        "col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0",
    },
    {
      title: "Allowed Cards",
      description: "Credit & debit cards.",
      topLeftIcon: "shopping-cart",
      topLeftIconBgWrapperColor: "teal-200",
      topLeftIconColor: "teal-700",
      topLeftIconBgWrapperWidth: "3.5rem",
      topLeftIconBgWrapperHeight: "3.5rem",
      topLeftIconBgWrapperBorderRadius: "10px",
      cardBgColor: "surface-card",
      cardBorderRadius: "8px",
      cardWrapper2Bg:
        "linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(160, 210, 250, 0.2)), linear-gradient(180deg, rgba(187, 199, 205, 0.2), rgba(145, 210, 204, 0.2))",
      mainWrapperClassName:
        "col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0",
    },
    {
      title: "Latest Products",
      description: "Latest products available.",
      topLeftIcon: "globe",
      topLeftIconBgWrapperColor: "blue-200",
      topLeftIconColor: "blue-700",
      topLeftIconBgWrapperWidth: "3.5rem",
      topLeftIconBgWrapperHeight: "3.5rem",
      topLeftIconBgWrapperBorderRadius: "10px",
      cardBgColor: "surface-card",
      cardBorderRadius: "8px",
      cardWrapper2Bg:
        "linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))",
      mainWrapperClassName:
        "col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0",
    },
    {
      title: "Security",
      description: "Your data is secured.",
      topLeftIcon: "eye",
      topLeftIconBgWrapperColor: "purple-200",
      topLeftIconColor: "purple-700",
      topLeftIconBgWrapperWidth: "3.5rem",
      topLeftIconBgWrapperHeight: "3.5rem",
      topLeftIconBgWrapperBorderRadius: "10px",
      cardBgColor: "surface-card",
      cardBorderRadius: "8px",
      cardWrapper2Bg:
        "linear-gradient(90deg, rgba(160, 210, 250, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(246, 158, 188, 0.2), rgba(212, 162, 221, 0.2))",
      mainWrapperClassName: "col-12 md:col-12 lg:col-4 p-0 lg-4 mt-4 lg:mt-0",
    },
  ];
  return cardsArr;
};

module.exports.getLandingPageBodyContentData = () => {
  const data = {
    header: "Marvelous Products",
    subheader: "Great & Wide range of products...",
    cardsDataArr: this.getLandingPageBodyContentCardsDataArr(),
    storyCard: {
      title: "Vinod Chauhan",
      subtitle: "VC Corporation Interactive",
      description:
        "VC Store is an online and offline electronics store. You can buy items by sitting at home and it will be delivered to you on time.",
      logoName: "company-logo",
      companyName: "VC Store",
    },
  };
  return data;
};

module.exports.getLandingPageHighlightSectionProductsDataArr = () => {
  const prodDataArr = [
    {
      imageSection: {
        imageName: "mockup",
        imageClass: "w-11",
        imageWrapperClass:
          "flex justify-content-center col-12 lg:col-6 bg-purple-100 p-0 flex-order-1 lg:flex-order-0",
        imageWrapperStyle: { borderRadius: "8px" },
      },
      dataSection: {
        icon: "mobile",
        heading: "Mobiles",
        description:
          "You will find a wide range of mobiles. Latest mobiles with latest technology from all brands. Big brands like Apple, Samsung, LG, Motorola, Sony.",
        mainWrapperClass:
          "col-12 lg:col-6 my-auto flex flex-column lg:align-items-end text-center lg:text-right",
        iconWrapperClass:
          "flex align-items-center justify-content-center bg-purple-200 align-self-center lg:align-self-end",
        iconWrapperStyle: {
          width: "4.2rem",
          height: "4.2rem",
          borderRadius: "10px",
        },
        iconColor: "purple-700",
        headingClass: "line-height-1 text-900 text-4xl font-normal",
        descriptionClass: "text-700 text-2xl line-height-3 ml-0 md:ml-2",
        descriptionStyle: { maxWidth: "650px" },
      },
      orientation: "image_from_ltr",
    },
    {
      imageSection: {
        imageName: "mockup-desktop",
        imageClass: "w-11",
        imageWrapperClass:
          "flex justify-content-end flex-order-1 sm:flex-order-2 col-12 lg:col-6 bg-yellow-100 p-0",
        imageWrapperStyle: { borderRadius: "8px" },
      },
      dataSection: {
        icon: "desktop",
        heading: "Desktops & Laptops",
        description:
          "You will find a wide range of desktops, laptops & macbooks. Latest desktops, laptops & macbooks with latest technology & OS from all brands. Big brands like Apple, Lenovo, Toshiba, Sony.",
        mainWrapperClass:
          "col-12 lg:col-6 my-auto flex flex-column text-center lg:text-left lg:align-items-start",
        iconWrapperClass:
          "flex align-items-center justify-content-center bg-yellow-200 align-self-center lg:align-self-start",
        iconWrapperStyle: {
          width: "4.2rem",
          height: "4.2rem",
          borderRadius: "10px",
        },
        iconColor: "yellow-700",
        headingClass: "line-height-1 text-900 text-4xl font-normal",
        descriptionClass: "text-700 text-2xl line-height-3 mr-0 md:mr-2",
        descriptionStyle: { maxWidth: "650px" },
      },
      orientation: "image_from_rtl",
    },
  ];
  return prodDataArr;
};

module.exports.getLandingPageHighlightSectionData = () => {
  const data = {
    header: "Products Higlights",
    subheader: "Few products to show...",
    productsDataArr: this.getLandingPageHighlightSectionProductsDataArr(),
  };
  return data;
};

module.exports.getLandingPageFooterSectionSubmenuDataArr = () => {
  const item1SubmenuArr = [
    {
      label: "About Us",
      route: "",
      wrapperClass: "line-height-3 text-xl block cursor-pointer mb-2 text-700",
      isNew: false,
      newImageName: "new-badge",
      newImageClass: "ml-2",
    },
    {
      label: "News",
      route: "",
      wrapperClass: "line-height-3 text-xl block cursor-pointer mb-2 text-700",
      isNew: false,
      newImageName: "new-badge",
      newImageClass: "ml-2",
    },
    {
      label: "Investor Relations",
      route: "",
      wrapperClass: "line-height-3 text-xl block cursor-pointer mb-2 text-700",
      isNew: false,
      newImageName: "new-badge",
      newImageClass: "ml-2",
    },
    {
      label: "Careers",
      route: "",
      wrapperClass: "line-height-3 text-xl block cursor-pointer mb-2 text-700",
      isNew: false,
      newImageName: "new-badge",
      newImageClass: "ml-2",
    },
  ];

  const item2SubmenuArr = [
    {
      label: "FAQ",
      route: "",
      wrapperClass: "line-height-3 text-xl block cursor-pointer mb-2 text-700",
      isNew: false,
      newImageName: "new-badge",
      newImageClass: "ml-2",
    },
    {
      label: "Blog",
      route: "",
      wrapperClass: "line-height-3 text-xl block cursor-pointer mb-2 text-700",
      isNew: true,
      newImageName: "new-badge",
      newImageClass: "ml-2",
    },
  ];

  const item3SubmenuArr = [
    {
      label: "Brand Policy",
      route: "",
      wrapperClass: "line-height-3 text-xl block cursor-pointer mb-2 text-700",
      isNew: true,
      newImageName: "new-badge",
      newImageClass: "ml-2",
    },
    {
      label: "Privacy Policy",
      route: "",
      wrapperClass: "line-height-3 text-xl block cursor-pointer mb-2 text-700",
      isNew: false,
      newImageName: "new-badge",
      newImageClass: "ml-2",
    },
    {
      label: "Terms of Service",
      route: "",
      wrapperClass: "line-height-3 text-xl block cursor-pointer mb-2 text-700",
      isNew: false,
      newImageName: "new-badge",
      newImageClass: "ml-2",
    },
  ];
  return { item1SubmenuArr, item2SubmenuArr, item3SubmenuArr };
};

module.exports.getLandingPageFooterSectionMenuDataArr = () => {
  const { item1SubmenuArr, item2SubmenuArr, item3SubmenuArr } =
    this.getLandingPageFooterSectionSubmenuDataArr();
  const menuArr = [
    {
      heading: "Company",
      wrapperClass: "col-12 md:col-3",
      headingClass: "font-medium text-2xl line-height-3 mb-3 text-900",
      footerSubmenuArr: item1SubmenuArr,
    },
    {
      heading: "Community",
      wrapperClass: "col-12 md:col-3 mt-4 md:mt-0",
      headingClass: "font-medium text-2xl line-height-3 mb-3 text-900",
      footerSubmenuArr: item2SubmenuArr,
    },
    {
      heading: "Legal",
      wrapperClass: "col-12 md:col-3 mt-4 md:mt-0",
      headingClass: "font-medium text-2xl line-height-3 mb-3 text-900",
      footerSubmenuArr: item3SubmenuArr,
    },
  ];
  return menuArr;
};

module.exports.getLandingPageFooterSectionData = () => {
  const data = {
    logoData: {
      logoName: "company-logo",
      companyName: "VC Store",
      logoRoute: "/",
      logoWrapperClass: "col-12 md:col-2",
      companyNameWrapperClass: "font-medium text-3xl text-900",
      logoLinkClass:
        "flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer",
      logoClass: "mr-2",
      logoWidth: "50",
      logoHeight: "50",
      logoWrapperStyle: { marginTop: "-1.5rem" },
    },
    footerMenuArr: this.getLandingPageFooterSectionMenuDataArr(),
  };
  return data;
};

module.exports.getLandingPageData = () => {
  const data = {
    topHeader: this.getLandingPageTopHeaderMenuData(),
    heroHeader: this.getLandingPageHeroHeaderData(),
    bodyContent: this.getLandingPageBodyContentData(),
    highlightSection: this.getLandingPageHighlightSectionData(),
    footerSection: this.getLandingPageFooterSectionData(),
  };
  return data;
};

module.exports.getClientLandingPageDataUtil = async () => {
  return {
    status: "success",
    message: `Client landing page data fetched successfully.`,
    data: this.getLandingPageData(),
  };
};
