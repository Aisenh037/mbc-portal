import { StatusCodes } from 'http-status-codes';

export function notFound(req, res, next) {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Route not found' });
}

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Something went wrong';
  const details = err.details || undefined;
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error('Error:', err);
  }
  res.status(statusCode).json({ message, details });
}

export class AppError extends Error {
  constructor(message, statusCode = StatusCodes.BAD_REQUEST, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}