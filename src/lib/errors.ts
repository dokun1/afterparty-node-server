export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(409, message);
    this.name = 'ConflictError';
  }
}

export class GoneError extends AppError {
  constructor(message = 'Resource is no longer available') {
    super(410, message);
    this.name = 'GoneError';
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests') {
    super(429, message);
    this.name = 'TooManyRequestsError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message = 'Validation failed',
    public errors?: Record<string, string[]>,
  ) {
    super(422, message);
    this.name = 'ValidationError';
  }
}
