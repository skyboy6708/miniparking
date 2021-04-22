var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
// var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var testRouter = require("./routes/test");
var authRouter = require("./routes/auth");
var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const models = require("./models/index.js");
var compression = require("compression");
var session = require("express-session");
const flash = require("connect-flash");
var app = express();

app.use(passport.initialize()); //passport 초기화

app.use(passport.session());
app.use(compression());
app.use(
  session({
    secret: "asadlfkj!@#!@#dfgasdg",
    resave: false,
    saveUninitialized: true,
  })
);

// app.use((req, res, next) => {
//   res.locals.flash = req.flash("flash");
//   next();
// });
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(flash());
// app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/test", testRouter);
// app.use("/index", indexRouter);
app.use("/", authRouter);

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
// nodemon ./bin/www
