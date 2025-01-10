const OrdersUtility = require("./ordersUtility");
const CartsUtility = require("./cartsUtility");
const CustomersUtility = require("./customersUtility");
const EmployeesUtility = require("./employeesUtility");
const DepartmentsUtility = require("./departmentsUtility");
const CountriesUtility = require("./countriesUtility");
const StatesUtility = require("./statesUtility");
const CitiesUtility = require("./citiesUtility");
const CompanyAccountsUtility = require("./companyAccountsUtility");
const CommonUtility = require("./commonUtility");

module.exports.getChartDataObjUtil = () => {
  const chartDataObj = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [],
  };
  return chartDataObj;
};

module.exports.getMonthsDataArrUtil = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
};

module.exports.getOrdersYearsArrUtil = async ({ ordersDataArr }) => {
  const ordersYearsArr = [];
  if (ordersDataArr && ordersDataArr.length > 0) {
    ordersDataArr.map((orderData) => {
      const orderDate = new Date(orderData?.dateAdded);
      const orderYear = orderDate?.getFullYear();
      const foundYearAlreadyAdded = ordersYearsArr.find(
        (year) => year === orderYear
      );
      if (!foundYearAlreadyAdded) {
        ordersYearsArr.push(orderYear);
      }
    });
  }

  if (ordersYearsArr.length <= 0) {
    ordersYearsArr.push(new Date().getFullYear());
  }

  ordersYearsArr.sort((a, b) => b - a);

  return ordersYearsArr;
};

module.exports.registeredInCurrentMonthYearObj = async ({ addedOnDate }) => {
  let updatedAddedOnDate = addedOnDate ? new Date(addedOnDate) : new Date();
  const addedOnMonthInNum = updatedAddedOnDate.getMonth() + 1;
  const addedOnYearInNum = updatedAddedOnDate.getFullYear();
  const todaysMonthInNum = new Date().getMonth() + 1;
  const todaysYearInNum = new Date().getFullYear();
  let isRegisteredInCurrentMonth = false;

  if (
    addedOnMonthInNum === todaysMonthInNum &&
    addedOnYearInNum === todaysYearInNum
  ) {
    isRegisteredInCurrentMonth = true;
  }

  return {
    updatedAddedOnDate,
    addedOnMonthInNum,
    addedOnYearInNum,
    todaysMonthInNum,
    todaysYearInNum,
    isRegisteredInCurrentMonth,
  };
};

module.exports.fetchRegisteredInCurrentMonth = async ({ itemsArr }) => {
  const newlyRegisteredItemsArr = [];

  itemsArr.map(async (itemData) => {
    const { isRegisteredInCurrentMonth } =
      await this.registeredInCurrentMonthYearObj({
        addedOnDate: itemData.dateAdded,
      });
    if (isRegisteredInCurrentMonth) {
      newlyRegisteredItemsArr.push(itemData);
    }
  });

  return newlyRegisteredItemsArr;
};

module.exports.getDashboardOrderDataUtil = async () => {
  const allOrdersDataObj = await OrdersUtility.getAllOrdersUtil({
    req: { body: {} },
  });
  const currentMonthOrdersArr = await this.fetchRegisteredInCurrentMonth({
    itemsArr: allOrdersDataObj?.data ?? [],
  });
  const orderDataObj = {
    allOrders: allOrdersDataObj?.data ?? [],
    currentMonthOrders: currentMonthOrdersArr,
    totalOrdersCount: allOrdersDataObj?.data ? allOrdersDataObj.data.length : 0,
    currentMonthOrdersCount: currentMonthOrdersArr.length,
  };
  return orderDataObj;
};

module.exports.getMonthWiseRevenueData = async ({ ordersDataArr }) => {
  const monthWiseRevenueDataArr = [];
  if (ordersDataArr && ordersDataArr.length > 0) {
    ordersDataArr.map((orderData) => {
      const orderDate = new Date(orderData.dateAdded);
      const orderMonth = orderDate.getMonth() + 1;
      const orderYear = orderDate.getFullYear();
      const payableAmount = orderData?.cart?.payableAmount
        ? Number(orderData.cart.payableAmount)
        : 0;
      const foundDataObjIndex = monthWiseRevenueDataArr?.findIndex(
        (monthWiseRevenueData) =>
          monthWiseRevenueData.year === orderYear &&
          monthWiseRevenueData.month === orderMonth
      );
      if (
        foundDataObjIndex !== undefined &&
        foundDataObjIndex !== null &&
        foundDataObjIndex !== -1
      ) {
        // ALREADY EXISTS
        const foundObjData = monthWiseRevenueDataArr[foundDataObjIndex];
        const foundDataObjAmount = foundObjData.amount + Number(payableAmount);
        const foundOrdersArr = foundObjData.ordersArr;
        const updatedFoundObjData = {
          ...foundObjData,
          amount: foundDataObjAmount,
          ordersArr: [...foundOrdersArr, orderData],
        };
        monthWiseRevenueDataArr[foundDataObjIndex] = updatedFoundObjData;
      } else {
        // NOT EXISTS
        monthWiseRevenueDataArr.push({
          year: orderYear,
          month: orderMonth,
          amount: payableAmount,
          ordersArr: [orderData],
        });
      }
    });
  }

  return monthWiseRevenueDataArr;
};

module.exports.getDashboardRevenueDataUtil = async ({ ordersDataArr }) => {
  let revenueData = {
    currentMonthRevenue: null,
    currentYearRevenue: null,
  };
  if (ordersDataArr && ordersDataArr.length > 0) {
    const monthWiseRevenueDataArr = await this.getMonthWiseRevenueData({
      ordersDataArr: ordersDataArr,
    });
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    if (monthWiseRevenueDataArr && monthWiseRevenueDataArr.length > 0) {
      monthWiseRevenueDataArr.map((monthWiseRevenueData) => {
        // ADD CURRENT MONTH'S REVENUE
        const revenueMonth = monthWiseRevenueData.month;
        const revenueYear = monthWiseRevenueData.year;
        if (revenueMonth === currentMonth && revenueYear === currentYear) {
          revenueData = {
            ...revenueData,
            currentMonthRevenue: monthWiseRevenueData,
          };
        }

        // ADD CURRENT YEAR'S REVENUE
        if (revenueYear === currentYear) {
          const prevAmount = revenueData?.currentYearRevenue?.amount ?? 0;
          const prevOrdersArr =
            revenueData?.currentYearRevenue?.ordersArr ?? [];
          const currentAmount = monthWiseRevenueData.amount;
          const currentOrdersArr = monthWiseRevenueData.ordersArr;
          revenueData = {
            ...revenueData,
            currentYearRevenue: {
              year: revenueYear,
              amount: prevAmount + currentAmount,
              ordersArr: [...prevOrdersArr, ...currentOrdersArr],
            },
          };
        }
      });
    }
  }
  return revenueData;
};

module.exports.getDashboardCartsDataUtil = async () => {
  const allCartsDataObj = await CartsUtility.getAllCartsUtil({
    req: { body: {} },
  });
  const currentMonthCartsArr = await this.fetchRegisteredInCurrentMonth({
    itemsArr: allCartsDataObj?.data ?? [],
  });
  const cartsDataObj = {
    allCarts: allCartsDataObj?.data ?? [],
    currentMonthCarts: currentMonthCartsArr,
    totalCartsCount: allCartsDataObj?.data ? allCartsDataObj.data.length : 0,
    currentMonthCartsCount: currentMonthCartsArr.length,
  };
  return cartsDataObj;
};

module.exports.getDashboardCustomersDataUtil = async () => {
  const allCustomersDataObj = await CustomersUtility.getAllCustomersUtil({
    req: { body: {} },
  });
  const currentMonthCustomersArr = await this.fetchRegisteredInCurrentMonth({
    itemsArr: allCustomersDataObj?.data ?? [],
  });
  const customersDataObj = {
    allCustomers: allCustomersDataObj?.data ?? [],
    currentMonthCustomers: currentMonthCustomersArr,
    totalCustomersCount: allCustomersDataObj?.data
      ? allCustomersDataObj.data.length
      : 0,
    currentMonthCustomersCount: currentMonthCustomersArr.length,
  };
  return customersDataObj;
};

module.exports.fetchActiveEmployees = async ({ allEmployeesDataArr }) => {
  const activeEmployees = [];

  allEmployeesDataArr.map((empData) => {
    if (empData?.statusDetails?.title?.toLowerCase() === "active") {
      activeEmployees.push(empData);
    }
  });

  return activeEmployees;
};

module.exports.getDashboardEmployeesDataUtil = async () => {
  const allEmployeesDataObj = await EmployeesUtility.getAllEmployeesUtil({
    req: { body: {} },
  });
  const activeEmployeesArr = await this.fetchActiveEmployees({
    allEmployeesDataArr: allEmployeesDataObj?.data ?? [],
  });
  const citiesDataObj = {
    allEmployees: allEmployeesDataObj?.data ?? [],
    activeEmployees: activeEmployeesArr,
    totalEmployeesCount: allEmployeesDataObj?.data
      ? allEmployeesDataObj.data.length
      : 0,
    activeEmployeesCount: activeEmployeesArr.length,
  };
  return citiesDataObj;
};

module.exports.getDashboardDepartmentsDataUtil = async () => {
  const allDepartmentsDataObj = await DepartmentsUtility.getAllDepartmentsUtil({
    req: { body: {} },
  });
  const currentMonthDepartmentsArr = await this.fetchRegisteredInCurrentMonth({
    itemsArr: allDepartmentsDataObj?.data ?? [],
  });
  const customersDataObj = {
    allDepartments: allDepartmentsDataObj?.data ?? [],
    currentMonthDepartments: currentMonthDepartmentsArr,
    totalDepartmentsCount: allDepartmentsDataObj?.data
      ? allDepartmentsDataObj.data.length
      : 0,
    currentMonthDepartmentsCount: currentMonthDepartmentsArr.length,
  };
  return customersDataObj;
};

module.exports.getDashboardCountriesDataUtil = async () => {
  const allCountriesDataObj = await CountriesUtility.getAllCountriesUtil({
    req: { body: {} },
  });
  const currentMonthCountriesArr = await this.fetchRegisteredInCurrentMonth({
    itemsArr: allCountriesDataObj?.data ?? [],
  });
  const countriesDataObj = {
    allCountries: allCountriesDataObj?.data ?? [],
    currentMonthCountries: currentMonthCountriesArr,
    totalCountriesCount: allCountriesDataObj?.data
      ? allCountriesDataObj.data.length
      : 0,
    currentMonthCountriesCount: currentMonthCountriesArr.length,
  };
  return countriesDataObj;
};

module.exports.getDashboardStatesDataUtil = async () => {
  const allStatesDataObj = await StatesUtility.getAllStatesUtil({
    req: { body: {} },
  });
  const currentMonthStatesArr = await this.fetchRegisteredInCurrentMonth({
    itemsArr: allStatesDataObj?.data ?? [],
  });
  const statesDataObj = {
    allStates: allStatesDataObj?.data ?? [],
    currentMonthStates: currentMonthStatesArr,
    totalStatesCount: allStatesDataObj?.data ? allStatesDataObj.data.length : 0,
    currentMonthStatesCount: currentMonthStatesArr.length,
  };
  return statesDataObj;
};

module.exports.getDashboardCitiesDataUtil = async () => {
  const allCitiesDataObj = await CitiesUtility.getAllCitiesUtil({
    req: { body: {} },
  });
  const currentMonthCitiesArr = await this.fetchRegisteredInCurrentMonth({
    itemsArr: allCitiesDataObj?.data ?? [],
  });
  const citiesDataObj = {
    allCities: allCitiesDataObj?.data ?? [],
    currentMonthCities: currentMonthCitiesArr,
    totalCitiesCount: allCitiesDataObj?.data ? allCitiesDataObj.data.length : 0,
    currentMonthCitiesCount: currentMonthCitiesArr.length,
  };
  return citiesDataObj;
};

module.exports.getDashboardCompanyAccountsDataUtil = async () => {
  const allCompanyAccountsDataObj =
    await CompanyAccountsUtility.getAllCompanyAccountsUtil({
      req: { body: {} },
    });
  const currentMonthCompanyAccountsArr =
    await this.fetchRegisteredInCurrentMonth({
      itemsArr: allCompanyAccountsDataObj?.data ?? [],
    });
  const citiesDataObj = {
    allCompanyAccounts: allCompanyAccountsDataObj?.data ?? [],
    currentMonthCompanyAccounts: currentMonthCompanyAccountsArr,
    totalCompanyAccountsCount: allCompanyAccountsDataObj?.data
      ? allCompanyAccountsDataObj.data.length
      : 0,
    currentMonthCompanyAccountsCount: currentMonthCompanyAccountsArr.length,
  };
  return citiesDataObj;
};

module.exports.getDashboardRevenueFromAllCompanyAcc = async ({ itemsArr }) => {
  let newItem = {
    accountBalance: 0,
    dataArr: [],
  };

  itemsArr.map((itemData) => {
    const newAccBalance = itemData?.accountBalance
      ? Number(itemData.accountBalance)
      : 0;
    const prevAccBalance = newItem?.accountBalance
      ? Number(newItem.accountBalance)
      : 0;
    const newDataArr = [itemData];
    const prevDataArr = newItem?.dataArr ? newItem.dataArr : [];

    newItem = {
      ...newItem,
      accountBalance: prevAccBalance + newAccBalance,
      dataArr: [...prevDataArr, ...newDataArr],
    };
  });

  return newItem;
};

module.exports.getDashboardCardsDataUtil = async () => {
  const orderDataObj = await this.getDashboardOrderDataUtil();
  const revenueDataObj = await this.getDashboardRevenueDataUtil({
    ordersDataArr: orderDataObj.allOrders,
  });
  const cartsDataObj = await this.getDashboardCartsDataUtil();
  const customersDataObj = await this.getDashboardCustomersDataUtil();
  const employeesDataObj = await this.getDashboardEmployeesDataUtil();
  const departmentsDataObj = await this.getDashboardDepartmentsDataUtil();
  const countriesDataObj = await this.getDashboardCountriesDataUtil();
  const statesDataObj = await this.getDashboardStatesDataUtil();
  const citiesDataObj = await this.getDashboardCitiesDataUtil();
  const companyAccountsDataObj =
    await this.getDashboardCompanyAccountsDataUtil();
  const revenueDataFromAllCompanyAccObj =
    await this.getDashboardRevenueFromAllCompanyAcc({
      itemsArr: companyAccountsDataObj.allCompanyAccounts,
    });
  const dashboardCardsData = {
    ordersData: orderDataObj,
    revenueData: revenueDataObj,
    cartsData: cartsDataObj,
    customersData: customersDataObj,
    employeesData: employeesDataObj,
    departmentsData: departmentsDataObj,
    countriesData: countriesDataObj,
    statesData: statesDataObj,
    citiesData: citiesDataObj,
    companyAccountsData: companyAccountsDataObj,
    revenueDataFromAllCompanyAcc: revenueDataFromAllCompanyAccObj,
  };

  return dashboardCardsData;
};

module.exports.getDashboardStructuralCardsDataUtil = async ({
  dashboardCardsData,
}) => {
  const { formatDisplayAmount } = CommonUtility;
  return {
    dataArr: [
      {
        title: "Orders",
        subtitle: `${dashboardCardsData.ordersData.totalOrdersCount}`,
        descriptiveInfo: `${dashboardCardsData.ordersData.currentMonthOrdersCount} new`,
        description: "this month",
        iconName: "pi-shopping-cart",
        iconBgColorClassName: "bg-blue-100",
        iconColorClassName: "text-blue-500",
        iconSizeClassName: "text-xl",
        titleColorClassName: "text-500",
        subtitleColorClassName: "text-900",
        descriptiveInfoColorClassName: "text-green-500",
        descriptionColorClassName: "text-500",
      },
      {
        title: "Revenue",
        subtitle: `${formatDisplayAmount({
          amount: dashboardCardsData?.revenueData?.currentYearRevenue?.amount,
        })}`,
        descriptiveInfo: `${formatDisplayAmount({
          amount: dashboardCardsData?.revenueData?.currentMonthRevenue?.amount,
        })}`,
        description: "this month",
        iconName: "pi-bitcoin",
        iconBgColorClassName: "bg-blue-100",
        iconColorClassName: "text-blue-500",
        iconSizeClassName: "text-xl",
        titleColorClassName: "text-500",
        subtitleColorClassName: "text-900",
        descriptiveInfoColorClassName: "text-green-500",
        descriptionColorClassName: "text-500",
      },
      {
        title: "Carts",
        subtitle: `${dashboardCardsData.cartsData.totalCartsCount} Active`,
        descriptiveInfo: `${dashboardCardsData.cartsData.currentMonthCartsCount} added`,
        description: "this month",
        iconName: "pi-cart-plus",
        iconBgColorClassName: "bg-orange-100",
        iconColorClassName: "text-orange-500",
        iconSizeClassName: "text-xl",
        titleColorClassName: "text-500",
        subtitleColorClassName: "text-900",
        descriptiveInfoColorClassName: "text-green-500",
        descriptionColorClassName: "text-500",
      },
      {
        title: "Customers",
        subtitle: `${dashboardCardsData.customersData.totalCustomersCount} Registered`,
        descriptiveInfo: `${dashboardCardsData.customersData.currentMonthCustomersCount}`,
        description: "registered this month",
        iconName: "pi-inbox",
        iconBgColorClassName: "bg-cyan-100",
        iconColorClassName: "text-cyan-500",
        iconSizeClassName: "text-xl",
        titleColorClassName: "text-500",
        subtitleColorClassName: "text-900",
        descriptiveInfoColorClassName: "text-green-500",
        descriptionColorClassName: "text-500",
      },
      {
        title: "Employees",
        subtitle: `${dashboardCardsData.employeesData.totalEmployeesCount} Registered`,
        descriptiveInfo: `${dashboardCardsData.employeesData.activeEmployeesCount}`,
        description: "active currently",
        iconName: "pi-users",
        iconBgColorClassName: "bg-purple-100",
        iconColorClassName: "text-purple-500",
        iconSizeClassName: "text-xl",
        titleColorClassName: "text-500",
        subtitleColorClassName: "text-900",
        descriptiveInfoColorClassName: "text-green-500",
        descriptionColorClassName: "text-500",
      },
      {
        title: "Departments",
        subtitle: `${dashboardCardsData.departmentsData.totalDepartmentsCount} Registered`,
        descriptiveInfo: `${dashboardCardsData.departmentsData.currentMonthDepartmentsCount}`,
        description: "registered this month",
        iconName: "pi-building",
        iconBgColorClassName: "bg-blue-100",
        iconColorClassName: "text-blue-500",
        iconSizeClassName: "text-xl",
        titleColorClassName: "text-500",
        subtitleColorClassName: "text-900",
        descriptiveInfoColorClassName: "text-green-500",
        descriptionColorClassName: "text-500",
      },
      {
        title: "Countries",
        subtitle: `${dashboardCardsData.countriesData.totalCountriesCount} Registered`,
        descriptiveInfo: `${dashboardCardsData.countriesData.currentMonthCountriesCount}`,
        description: "registered this month",
        iconName: "pi-flag",
        iconBgColorClassName: "bg-orange-100",
        iconColorClassName: "text-orange-500",
        iconSizeClassName: "text-xl",
        titleColorClassName: "text-500",
        subtitleColorClassName: "text-900",
        descriptiveInfoColorClassName: "text-green-500",
        descriptionColorClassName: "text-500",
      },
      {
        title: "States",
        subtitle: `${dashboardCardsData.statesData.totalStatesCount} Registered`,
        descriptiveInfo: `${dashboardCardsData.statesData.currentMonthStatesCount}`,
        description: "registered this month",
        iconName: "pi-bookmark",
        iconBgColorClassName: "bg-cyan-100",
        iconColorClassName: "text-cyan-500",
        iconSizeClassName: "text-xl",
        titleColorClassName: "text-500",
        subtitleColorClassName: "text-900",
        descriptiveInfoColorClassName: "text-green-500",
        descriptionColorClassName: "text-500",
      },
      {
        title: "Cities",
        subtitle: `${dashboardCardsData.citiesData.totalCitiesCount} Registered`,
        descriptiveInfo: `${dashboardCardsData.citiesData.currentMonthCitiesCount}`,
        description: "registered this month",
        iconName: "pi-map-marker",
        iconBgColorClassName: "bg-purple-100",
        iconColorClassName: "text-purple-500",
        iconSizeClassName: "text-xl",
        titleColorClassName: "text-500",
        subtitleColorClassName: "text-900",
        descriptiveInfoColorClassName: "text-green-500",
        descriptionColorClassName: "text-500",
      },
      {
        title: "Company Accounts",
        subtitle: `${dashboardCardsData.companyAccountsData.totalCompanyAccountsCount} Registered`,
        descriptiveInfo: `${dashboardCardsData.companyAccountsData.currentMonthCompanyAccountsCount}`,
        description: "registered this month",
        iconName: "pi-key",
        iconBgColorClassName: "bg-purple-100",
        iconColorClassName: "text-purple-500",
        iconSizeClassName: "text-xl",
        titleColorClassName: "text-500",
        subtitleColorClassName: "text-900",
        descriptiveInfoColorClassName: "text-green-500",
        descriptionColorClassName: "text-500",
      },
      {
        title: "Accounts Revenue",
        subtitle: `${formatDisplayAmount({
          amount:
            dashboardCardsData.revenueDataFromAllCompanyAcc.accountBalance,
        })}`,
        descriptiveInfo: `Associated from`,
        description: `${dashboardCardsData.companyAccountsData.totalCompanyAccountsCount} accounts`,
        iconName: "pi-bitcoin",
        iconBgColorClassName: "bg-purple-100",
        iconColorClassName: "text-purple-500",
        iconSizeClassName: "text-xl",
        titleColorClassName: "text-500",
        subtitleColorClassName: "text-900",
        descriptiveInfoColorClassName: "text-500",
        descriptionColorClassName: "text-green-500",
      },
    ],
  };
};

module.exports.getAllOrderedProductsArr = async ({
  ordersDataArr,
  overviewYear,
}) => {
  const allOrderedProductsDetailsArr = [];

  if (ordersDataArr && ordersDataArr.length > 0) {
    ordersDataArr.map((orderData) => {
      const orderDate = new Date(orderData?.dateAdded);
      const orderMonth = orderDate?.getMonth() + 1;
      const orderYear = orderDate?.getFullYear();

      if (orderYear === overviewYear) {
        const cartData = orderData?.cart;
        const productsArr = cartData?.products ?? [];
        productsArr.map((productData) => {
          const productName = `${productData?.productDetails?.brandDetails?.title} ${productData?.productDetails?.title} (${productData?.productDetails?.categoryDetails?.title})`;
          const foundIndexInOrderedProductObj =
            allOrderedProductsDetailsArr?.findIndex(
              (orderedProductsDetailsData) =>
                orderedProductsDetailsData?.productName === productName &&
                orderedProductsDetailsData?.orderMonth === orderMonth
            );
          if (
            foundIndexInOrderedProductObj !== undefined &&
            foundIndexInOrderedProductObj !== null &&
            foundIndexInOrderedProductObj !== -1
          ) {
            const foundDataObj =
              allOrderedProductsDetailsArr[foundIndexInOrderedProductObj];
            const updatedDataObj = {
              ...foundDataObj,
              count: Number(foundDataObj.count) + Number(productData.count),
            };
            allOrderedProductsDetailsArr[foundIndexInOrderedProductObj] =
              updatedDataObj;
          } else {
            allOrderedProductsDetailsArr.push({
              orderDate: orderDate,
              orderMonth: orderMonth,
              orderYear: orderYear,
              productName: `${productData?.productDetails?.brandDetails?.title} ${productData?.productDetails?.title} (${productData?.productDetails?.categoryDetails?.title})`,
              count: productData?.count ?? 0,
              productData: productData.productDetails,
            });
          }
        });
      }
    });
  }
  return allOrderedProductsDetailsArr;
};

module.exports.getSalesOverviewDataUtil = async ({
  ordersDataArr,
  overviewYear,
}) => {
  let chartDataObj = this.getChartDataObjUtil();

  const monthsInNumberArr = this.getMonthsDataArrUtil();

  if (ordersDataArr && ordersDataArr.length > 0) {
    const datasets = [];

    const allOrderedProductsDetailsArr = await this.getAllOrderedProductsArr({
      ordersDataArr: ordersDataArr,
      overviewYear: overviewYear,
    });

    allOrderedProductsDetailsArr.map((orderedProductsDetailsData) => {
      const datasetDataArr = [];
      const orderMonth = orderedProductsDetailsData.orderMonth;

      const foundDatasetIndex = datasets.findIndex(
        (dataset) => dataset.label === orderedProductsDetailsData.productName
      );
      if (
        foundDatasetIndex !== undefined &&
        foundDatasetIndex !== null &&
        foundDatasetIndex !== -1
      ) {
        // dataset exists
        const foundDatasetObj = datasets[foundDatasetIndex];
        const foundDatasetDataArr = foundDatasetObj.data;
        foundDatasetDataArr[orderMonth - 1] = orderedProductsDetailsData.count;
        const updatedFoundDatasetObj = {
          ...foundDatasetObj,
          data: foundDatasetDataArr,
        };
        datasets[foundDatasetIndex] = updatedFoundDatasetObj;
      } else {
        // dataset not exists
        monthsInNumberArr.map((monthInNumber) => {
          if (orderMonth === monthInNumber) {
            datasetDataArr.push(orderedProductsDetailsData.count);
          } else {
            datasetDataArr.push(0);
          }
        });
        datasets.push({
          label: orderedProductsDetailsData.productName,
          data: datasetDataArr,
          fill: false,
          backgroundColor: CommonUtility.getRandomHexColorCode(),
          borderColor: CommonUtility.getRandomHexColorCode(),
          tension: 0.4,
        });
      }
    });

    chartDataObj = {
      ...chartDataObj,
      datasets: datasets,
    };
  }
  return chartDataObj;
};

module.exports.getSalesOverviewChartDataUtil = async ({ req }) => {
  let overviewYear =
    req?.body?.overviewYear && req.body.overviewYear !== ""
      ? Number(req.body.overviewYear)
      : 0;
  if (
    !overviewYear ||
    overviewYear === 0 ||
    overviewYear.toString().length < 4
  ) {
    overviewYear = new Date().getFullYear();
  }

  const allOrdersDataObj = await OrdersUtility.getAllOrdersUtil({
    req: { body: {} },
  });

  const chartData = await this.getSalesOverviewDataUtil({
    ordersDataArr: allOrdersDataObj?.data ?? [],
    overviewYear: overviewYear,
  });

  return {
    status: "success",
    message: `Sales overview chart data fetched successfully.`,
    data: chartData,
  };
};

module.exports.getRevenueOverviewDataUtil = async ({
  ordersDataArr,
  overviewYear,
}) => {
  let chartDataObj = this.getChartDataObjUtil();

  const monthsInNumberArr = this.getMonthsDataArrUtil();

  if (ordersDataArr && ordersDataArr.length > 0) {
    const datasets = [];

    const allOrderedProductsDetailsArr = await this.getAllOrderedProductsArr({
      ordersDataArr: ordersDataArr,
      overviewYear: overviewYear,
    });

    allOrderedProductsDetailsArr.map((orderedProductsDetailsData) => {
      const datasetDataArr = [];
      const orderMonth = orderedProductsDetailsData.orderMonth;

      const foundDatasetIndex = datasets.findIndex(
        (dataset) => dataset.label === orderedProductsDetailsData.productName
      );
      if (
        foundDatasetIndex !== undefined &&
        foundDatasetIndex !== null &&
        foundDatasetIndex !== -1
      ) {
        // dataset exists
        const foundDatasetObj = datasets[foundDatasetIndex];
        const foundDatasetDataArr = foundDatasetObj.data;
        foundDatasetDataArr[orderMonth - 1] =
          Number(
            orderedProductsDetailsData.productData.priceDetails.discountedPrice
          ) * Number(orderedProductsDetailsData.count);
        const updatedFoundDatasetObj = {
          ...foundDatasetObj,
          data: foundDatasetDataArr,
        };
        datasets[foundDatasetIndex] = updatedFoundDatasetObj;
      } else {
        // dataset not exists
        monthsInNumberArr.map((monthInNumber) => {
          if (orderMonth === monthInNumber) {
            datasetDataArr.push(
              Number(
                orderedProductsDetailsData.productData.priceDetails
                  .discountedPrice
              ) * Number(orderedProductsDetailsData.count)
            );
          } else {
            datasetDataArr.push(0);
          }
        });
        datasets.push({
          label: orderedProductsDetailsData.productName,
          data: datasetDataArr,
          fill: false,
          backgroundColor: CommonUtility.getRandomHexColorCode(),
          borderColor: CommonUtility.getRandomHexColorCode(),
          tension: 0.4,
        });
      }
    });

    chartDataObj = {
      ...chartDataObj,
      datasets: datasets,
    };
  }

  return chartDataObj;
};

module.exports.getRevenueOverviewChartDataUtil = async ({ req }) => {
  let overviewYear =
    req?.body?.overviewYear && req.body.overviewYear !== ""
      ? Number(req.body.overviewYear)
      : 0;
  if (
    !overviewYear ||
    overviewYear === 0 ||
    overviewYear.toString().length < 4
  ) {
    overviewYear = new Date().getFullYear();
  }

  const allOrdersDataObj = await OrdersUtility.getAllOrdersUtil({
    req: { body: {} },
  });

  const chartData = await this.getRevenueOverviewDataUtil({
    ordersDataArr: allOrdersDataObj?.data ?? [],
    overviewYear: overviewYear,
  });

  return {
    status: "success",
    message: `Revenue overview chart data fetched successfully.`,
    data: chartData,
  };
};

module.exports.getOrdersYearsDropdownArrUtil = async ({ ordersDataArr }) => {
  const ordersYearsArr = await this.getOrdersYearsArrUtil({
    ordersDataArr: ordersDataArr,
  });

  const itemDropdownArr = [];
  ordersYearsArr.map((orderYear, index) => {
    itemDropdownArr.push({
      id: `${(index + 1).toString()}`,
      label: `${orderYear}`,
      value: `${orderYear}`,
      code: `${orderYear}`,
    });
  });
  return itemDropdownArr;
};

module.exports.getAdminDashboardDataUtil = async () => {
  const dashboardCardsData = await this.getDashboardCardsDataUtil();
  const dashboardStructuralCardsData =
    await this.getDashboardStructuralCardsDataUtil({ dashboardCardsData });
  const currentYear = new Date().getFullYear();
  const salesOverviewChartDataObj = await this.getSalesOverviewChartDataUtil({
    req: {
      body: {
        overviewYear: `${currentYear}`,
      },
    },
  });
  const revenueOverviewChartDataObj =
    await this.getRevenueOverviewChartDataUtil({
      req: {
        body: {
          overviewYear: `${currentYear}`,
        },
      },
    });
  const ordersYearsDropdownArr = await this.getOrdersYearsDropdownArrUtil({
    ordersDataArr: dashboardCardsData.ordersData.allOrders,
  });

  return {
    status: "success",
    message: `Admin dashboard data found successfully.`,
    data: {
      dashboardCardsData: dashboardCardsData,
      dashboardStructuralCardsData: dashboardStructuralCardsData,
      dashboardChartsData: {
        currentSalesOverviewChartData: salesOverviewChartDataObj?.data ?? null,
        currentRevenueOverviewChartData:
          revenueOverviewChartDataObj?.data ?? null,
      },
      ordersYearsDropdownArr: ordersYearsDropdownArr,
    },
  };
};
