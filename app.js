const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");

const productsRouter = require("./routes/products");

const app = express();


app.use(logger("dev"));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/products", productsRouter);

app.use("/", express.static("public"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  console.log(err);

  // set locals, only providing error in development
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
