var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
var indexRouter = require("./routes/index");

var app = express();
app.use(cors());
const adminRouter = require("./routes/admin");
const ownerRouter = require("./routes/owner");
const pointRouter = require("./routes/point");
const menuRouter = require("./routes/menuItem");
const saleRouter = require("./routes/sale");
const feedBackRouter = require("./routes/feedBack");
const userRouter = require("./routes/users");
const apiDocs = require("./swagger/api-documentation.json");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(apiDocs, {
    explorer: true,
  })
);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/owners", ownerRouter);
app.use("/api/v1/points", pointRouter);
app.use("/api/v1/menus", menuRouter);
app.use("/api/v1/sales", saleRouter);
app.use("/api/v1/feedbacks", feedBackRouter);
app.use("/api/v1/users", userRouter);

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
