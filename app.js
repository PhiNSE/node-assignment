var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");

const usersApiRouter = require("./routes/api/users.controller");
const userRolesApiRouter = require("./routes/api/user-roles.controller");
const categoryApiRouter = require("./routes/api/categories.controller");
const productApiRouter = require("./routes/api/products.controller");
const loginUiRouter = require("./routes/ui/login.ui");
const adminUiRouter = require("./routes/ui/admin.ui");
const productsUiRouter = require("./routes/ui/products.ui");
const categoriesUiRouter = require("./routes/ui/categories.ui");

var app = express();

main()
  .then(() => {
    console.log("db connection success");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb://127.0.0.1:27017/node-assignment-product-app"
  );
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//apis
app.use("/", loginUiRouter);
app.use("/api/user-roles", userRolesApiRouter);
app.use("/api/users", usersApiRouter);
app.use("/api/categories", categoryApiRouter);
app.use("/api/products", productApiRouter);
app.use("/admin", adminUiRouter);
app.use("/products", productsUiRouter);
app.use("/categories", categoriesUiRouter);

//ui
app.use(loginUiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
