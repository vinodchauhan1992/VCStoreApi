//initializes
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

//app
const app = express();

//port
const port = process.env.PORT || 6400;

// Schedulers
// require("./schedulers/v3/AttendanceScheduler");

//routes v1
const productsRouteV1 = require("./routes/v1/products");
// const homeRouteV1 = require("./routes/v1/home");
const cartRouteV1 = require("./routes/v1/cart");
const userRouteV1 = require("./routes/v1/user");
const authRouteV1 = require("./routes/v1/auth");
const categoriesRouteV1 = require("./routes/v1/categories");
const userRolesRouteV1 = require("./routes/v1/userRoles");
const userStatusesRouteV1 = require("./routes/v1/userStatuses");
const fileUploaderRouteV1 = require("./routes/v1/fileUploader");
const fileFoldersRouteV1 = require("./routes/v1/fileFolders");

//routes v2
const categoriesRouteV2 = require("./routes/v2/categories");
const productsRouteV2 = require("./routes/v2/products");
// const homeRouteV2 = require("./routes/v2/home");
const cartRouteV2 = require("./routes/v2/cart");
const userRouteV2 = require("./routes/v2/user");
const authRouteV2 = require("./routes/v2/auth");
const userRolesRouteV2 = require("./routes/v2/userRoles");
const userStatusesRouteV2 = require("./routes/v2/userStatuses");
const fileUploaderRouteV2 = require("./routes/v2/fileUploader");
const fileFoldersRouteV2 = require("./routes/v2/fileFolders");
const adminMenuRouteV2 = require("./routes/v2/adminMenu");
const adminMenuStatusesRouteV2 = require("./routes/v2/adminMenuStatuses");
const adminSubmenuRouteV2 = require("./routes/v2/adminSubmenu");
const adminCombinedMenuRouteV2 = require("./routes/v2/adminCombinedMenu");
const brandsRouteV2 = require("./routes/v2/brands");
const stocksRouteV2 = require("./routes/v2/stocks");
const countriesV2 = require("./routes/v2/countries");
const statesV2 = require("./routes/v2/states");
const citiesV2 = require("./routes/v2/cities");
const userDropdownMenuV2 = require("./routes/v2/userDropdownMenu");

//routes v3
const categoriesRouteV3 = require("./routes/v3/categories");
const productsRouteV3 = require("./routes/v3/products");
const homeRouteV3 = require("./routes/v3/home");
const authRouteV3 = require("./routes/v3/auth");
const brandsRouteV3 = require("./routes/v3/brands");
const stocksRouteV3 = require("./routes/v3/stocks");
const countriesV3 = require("./routes/v3/countries");
const statesV3 = require("./routes/v3/states");
const citiesV3 = require("./routes/v3/cities");
const gendersV3 = require("./routes/v3/genders");
const departmentsV3 = require("./routes/v3/departments");
const employeesV3 = require("./routes/v3/employees");
const customersV3 = require("./routes/v3/customers");
const employeeRolesV3 = require("./routes/v3/employeeRoles");
const statusesV3 = require("./routes/v3/statuses");
const employeeLoginsV3 = require("./routes/v3/employeesLogin");
const appIdsV3 = require("./routes/v3/appIds");
const employeeSalariesV3 = require("./routes/v3/employeeSalaries");
const attendancesV3 = require("./routes/v3/attendances");
const clientBannersV3 = require("./routes/v3/clientBanners");
const productColorsV3 = require("./routes/v3/productColors");
const ratingsV3 = require("./routes/v3/ratings");
const wishlistsV3 = require("./routes/v3/wishlists");
const cartsV3 = require("./routes/v3/carts");
const deliveryStatusesV3 = require("./routes/v3/deliveryStatuses");
const ordersV3 = require("./routes/v3/orders");
const invoicesV3 = require("./routes/v3/invoices");
const faqsV3 = require("./routes/v3/faqs");
const companyAccountsV3 = require("./routes/v3/companyAccounts");
const accountsHistoryV3 = require("./routes/v3/accountsHistory");
const adminDashboardV3 = require("./routes/v3/adminDashboard");
const clientLandingPageV3 = require("./routes/v3/clientLandingPage");
const customersLoginsV3 = require("./routes/v3/customersLogin");
const clientMiscV3 = require("./routes/v3/clientMisc");
const clientHomePageV3 = require("./routes/v3/clientHomePage");
const contactUsV3 = require("./routes/v3/contactUs");

//middleware
app.use(cors());

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//view engine
app.set("view engine", "ejs");
app.set("views", "views");

app.disable("view cache");

// use v1
// app.use("/", homeRouteV1);
app.use("/v1/products", productsRouteV1);
app.use("/v1/carts", cartRouteV1);
app.use("/v1/users", userRouteV1);
app.use("/v1/auth", authRouteV1);
app.use("/v1/categories", categoriesRouteV1);
app.use("/v1/userRoles", userRolesRouteV1);
app.use("/v1/userStatuses", userStatusesRouteV1);
app.use("/v1/fileUploader", fileUploaderRouteV1);
app.use("/v1/fileFolders", fileFoldersRouteV1);

// use v2
// app.use("/", homeRouteV2);
app.use("/v2/categories", categoriesRouteV2);
app.use("/v2/products", productsRouteV2);
app.use("/v2/carts", cartRouteV2);
app.use("/v2/users", userRouteV2);
app.use("/v2/auth", authRouteV2);
app.use("/v2/userRoles", userRolesRouteV2);
app.use("/v2/userStatuses", userStatusesRouteV2);
app.use("/v2/fileUploader", fileUploaderRouteV2);
app.use("/v2/fileFolders", fileFoldersRouteV2);
app.use("/v2/adminMenu", adminMenuRouteV2);
app.use("/v2/adminMenuStatuses", adminMenuStatusesRouteV2);
app.use("/v2/adminSubmenu", adminSubmenuRouteV2);
app.use("/v2/adminCombinedMenu", adminCombinedMenuRouteV2);
app.use("/v2/brands", brandsRouteV2);
app.use("/v2/stocks", stocksRouteV2);
app.use("/v2/countries", countriesV2);
app.use("/v2/states", statesV2);
app.use("/v2/cities", citiesV2);
app.use("/v2/userDropdownMenu", userDropdownMenuV2);

// use v3
app.use("/", homeRouteV3);
app.use("/v3/categories", categoriesRouteV3);
app.use("/v3/products", productsRouteV3);
app.use("/v3/auth", authRouteV3);
app.use("/v3/brands", brandsRouteV3);
app.use("/v3/stocks", stocksRouteV3);
app.use("/v3/countries", countriesV3);
app.use("/v3/states", statesV3);
app.use("/v3/cities", citiesV3);
app.use("/v3/genders", gendersV3);
app.use("/v3/departments", departmentsV3);
app.use("/v3/employees", employeesV3);
app.use("/v3/customers", customersV3);
app.use("/v3/employeeRoles", employeeRolesV3);
app.use("/v3/statuses", statusesV3);
app.use("/v3/employeeLogins", employeeLoginsV3);
app.use("/v3/appIds", appIdsV3);
app.use("/v3/employeeSalaries", employeeSalariesV3);
app.use("/v3/attendances", attendancesV3);
app.use("/v3/clientBanners", clientBannersV3);
app.use("/v3/productColors", productColorsV3);
app.use("/v3/ratings", ratingsV3);
app.use("/v3/wishlists", wishlistsV3);
app.use("/v3/carts", cartsV3);
app.use("/v3/deliveryStatuses", deliveryStatusesV3);
app.use("/v3/orders", ordersV3);
app.use("/v3/invoices", invoicesV3);
app.use("/v3/faqs", faqsV3);
app.use("/v3/companyAccounts", companyAccountsV3);
app.use("/v3/accountsHistory", accountsHistoryV3);
app.use("/v3/adminDashboard", adminDashboardV3);
app.use("/v3/clientLandingPage", clientLandingPageV3);
app.use("/v3/customersLogins", customersLoginsV3);
app.use("/v3/clientMisc", clientMiscV3);
app.use("/v3/clientHomePage", clientHomePageV3);
app.use("/v3/contactUs", contactUsV3);

//mongoose
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(process.env.MONGO_DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    app.listen(port, () => {
      console.log("VCStore MongoDB is connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
