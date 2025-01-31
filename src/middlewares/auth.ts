import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../shared/config/secrets";
import { UserModel } from "../models/userModels";
import { AppError } from "../shared/helpers/AppError"; // Assuming AppError is available

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new AppError("No token provided", 401));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await UserModel.findById(payload?.userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid token", 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expired", 401));
    }

    return next(new AppError("Authentication error", 500));
  }
};

export default authMiddleware;
