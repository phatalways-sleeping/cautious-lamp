const AppError = require("../utils/appError");

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong",
    msg: err.message,
  });
};

const handleCastErrorDB = (err, req, res) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError("Invalid token. Please login again.", 401);

const handleTokenExpiredError = () =>
  new AppError("Your token has expired! Please login again", 401);

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
  if (req.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
  }
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong",
    msg: "Something went wrong! Please try again.",
  });
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/([^"]*)/)[0];
  const message = `Duplicate field ${value}. Please use another value`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    /// Handling Error of MongoDB in production
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJsonWebTokenError();
    }
    if (error.name === "TokenExpiredError") {
      error = handleTokenExpiredError();
    }
    sendErrorProd(error, req, res);
  }
};
