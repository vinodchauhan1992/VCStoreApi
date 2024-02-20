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

//routes
const productsRoute = require("./routes/products");
const homeRoute = require("./routes/home");
const cartRoute = require("./routes/cart");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const categoriesRoute = require("./routes/categories");
const userRolesRoute = require("./routes/userRoles");
const userStatusesRoute = require("./routes/userStatuses");


//middleware
app.use(cors());

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//view engine
app.set("view engine", "ejs");
app.set("views", "views");

app.disable("view cache");

app.use("/", homeRoute);
app.use("/products", productsRoute);
app.use("/carts", cartRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/categories", categoriesRoute);
app.use("/userRoles", userRolesRoute);
app.use("/userStatuses", userStatusesRoute);

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
