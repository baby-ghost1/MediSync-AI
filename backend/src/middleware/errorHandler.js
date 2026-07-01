const errorHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode =
    err.statusCode || 500;

  let message =
    err.message ||
    "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(
      err.errors
    )
      .map((item) => item.message)
      .join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;

    message = "Invalid resource id.";
  }

  if (err.code === 11000) {
    statusCode = 409;

    message = `${Object.keys(
      err.keyValue
    )} already exists.`;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;

    message = "Invalid token.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;

    message = "Token expired.";
  }

  res.status(statusCode).json({
    success: false,

    message,

    ...(process.env.NODE_ENV !==
      "production" && {
      stack: err.stack,
    }),
  });
};

export default errorHandler;