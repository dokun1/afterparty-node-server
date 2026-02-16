import { describe, it, expect } from 'vitest';
import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  GoneError,
  TooManyRequestsError,
  ValidationError,
} from '../../src/lib/errors';

describe('Custom error classes', () => {
  it('AppError sets statusCode and message', () => {
    const err = new AppError(418, "I'm a teapot");
    expect(err.statusCode).toBe(418);
    expect(err.message).toBe("I'm a teapot");
    expect(err).toBeInstanceOf(Error);
  });

  it('NotFoundError defaults to 404', () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Resource not found');
  });

  it('UnauthorizedError defaults to 401', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
  });

  it('ForbiddenError defaults to 403', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
  });

  it('GoneError defaults to 410', () => {
    const err = new GoneError();
    expect(err.statusCode).toBe(410);
  });

  it('TooManyRequestsError defaults to 429', () => {
    const err = new TooManyRequestsError();
    expect(err.statusCode).toBe(429);
  });

  it('ValidationError includes field errors', () => {
    const err = new ValidationError('Bad input', { name: ['required'] });
    expect(err.statusCode).toBe(422);
    expect(err.errors).toEqual({ name: ['required'] });
  });
});
