export const notFoundMiddleware = (req, res, next) => {
  if (req.originalUrl === "/favicon.ico") {
    return res.status(204).end();
  }
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );
  error.statusCode = 404;
  next(error);
};

export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Database validation failed",
      errors: Object.values(err.errors).map((error) => ({
        field: error.path,
        message: error.message,
      })),
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    return res.status(409).json({
      message: `${field} already exists`,
    });
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
};