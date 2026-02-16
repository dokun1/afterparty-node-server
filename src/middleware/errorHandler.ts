import type { ErrorRequestHandler } from 'express';
import { AppError, ValidationError } from '../lib/errors';
import { env } from '../config/env';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      error: err.message,
      details: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    error: env.NODE_ENV === 'production' ? 'Internal server error' : (err as Error).message,
  });
};
