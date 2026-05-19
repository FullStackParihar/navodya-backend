import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  } else if (err.type === 'StripeInvalidRequestError') {
    statusCode = 400;
    message = 'Invalid payment request';
  } else if (err.type === 'StripeAuthenticationError') {
    statusCode = 500;
    message = 'Payment gateway misconfigured';
  }

  // Log non-operational (unhandled) errors securely to the server
  if (config.nodeEnv === 'development' || !isOperational) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} >>`, err);
  }

  res.status(statusCode).json({
    success: false,
    message: config.nodeEnv === 'production' && statusCode === 500 ? 'Internal server error' : message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
