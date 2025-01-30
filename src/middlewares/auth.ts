import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../shared/config/secrets";
import { UserModel } from "../models/userModels";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return next();
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await UserModel.find({
      where: { id: payload?.userId },
    });

    if (!user) {
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    next();
  }
};

export default authMiddleware;
