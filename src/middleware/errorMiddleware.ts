import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { sendError } from '../utils/response';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, string>;
  errors?: Record<string, { message: string }>;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error:', err.message);

  // Mongoose duplicate key
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    sendError(res, `${field} already exists. Please use a different one.`, 409);
    return;
  }

  // Mongoose validation error
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map(e => e.message);
    sendError(res, 'Validation failed', 400, messages);
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err instanceof MongooseError.CastError) {
    sendError(res, 'Invalid ID format', 400);
    return;
  }

  // JWT errors handled in middleware
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token has expired', 401);
    return;
  }

  sendError(res, err.message || 'Internal server error', err.statusCode || 500);
};

export const notFound = (_req: Request, res: Response): void => {
  sendError(res, `Route not found`, 404);
};