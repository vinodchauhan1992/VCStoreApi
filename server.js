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

//routes v1
const productsRouteV1 = require("./routes/v1/products");
const homeRouteV1 = require("./routes/v1/home");
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
app.use("/", homeRouteV1);
app.use("/v1/products", productsRouteV1);
app.use("/v1/carts", cartRouteV1);
app.use("/v1/users", userRouteV1);
app.use("/v1/auth", authRouteV1);
app.use("/v1/categories", categoriesRouteV1);
app.use("/v1/userRoles", userRolesRouteV1);
app.use("/v1/userStatuses", userStatusesRouteV1);
app.use("/v1/fileUploader", fileUploaderRouteV1);
app.use("/v1/fileFolders", fileFoldersRouteV1);

// use v1
app.use("/", homeRouteV1);
app.use("/v2/categories", categoriesRouteV2);

//mongoose
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(process.env.MONGO_DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    app.listen(port, () => {
      console.log("VCEcommerce shop MongoDB is connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
