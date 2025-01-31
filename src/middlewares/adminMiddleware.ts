import { NextFunction, Response, Request } from "express";
import { AppError } from "../shared/helpers/AppError";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return next(new AppError("Access denied. Please log in.", 401));
  }

  if (user.role === "ADMIN") {
    return next();
  }

  return next(
    new AppError("You do not have permission to access this resource.", 403)
  );
};

export default adminMiddleware;
