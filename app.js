var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

const { logError, sendError } = require("./middlewares/errors-handlers");
require("dotenv").config({
  path: path.join(__dirname, `${process.env.NODE_ENV}.env`)
});

require("./config/mongoose"); 

var indexRouter = require("./routes/index.routes");

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", indexRouter);

app.use(logError);
app.use(sendError);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
