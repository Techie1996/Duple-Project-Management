import { StatusCodes } from 'http-status-codes';

// Centralized error handling middleware
// In later phases we'll extend this with custom error classes
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    message
  });
};

export const notFoundHandler = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    data: null,
    message: 'Route not found'
  });
};

