import type { Request, Response, NextFunction } from "express";
import { AppError } from "../helpers/AppError";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof AppError)) {
    const statusCode = error instanceof ZodError ? 400 : 500;
    const message = error.message || "Something went wrong";
    error = new AppError(message, statusCode);
  }

  const appError = error as AppError;

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(appError, res);
  } else {
    sendErrorProd(appError, res);
  }
};

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

export const handleZodError = (err: ZodError): AppError => {
  const errors = err.errors.map((error) => ({
    field: error.path.join("."),
    message: error.message,
  }));
  const message = "Validation failed";
  return new AppError(message, 400, errors);
};
