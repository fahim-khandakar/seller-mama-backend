// Custom Error class to standardize error messages
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // If it's an expected operational error
    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };
