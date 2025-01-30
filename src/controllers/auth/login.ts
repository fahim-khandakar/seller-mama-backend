import { NextFunction, Request, Response } from "express";
import { compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { UserModel } from "../../models/userModels";
import { JWT_SECRET } from "../../shared/config/secrets";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const findUser = await UserModel.findOne({
      where: { email: email },
    });
    if (!findUser) {
      next();
      return;
    }

    if (!compareSync(password, findUser.password)) {
      next();
      return;
    }

    const token = jwt.sign(
      { userId: findUser.id, email: findUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      status: 200,
      data: { token },
      message: "User logged in successfully",
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
