import { NextFunction, Request, Response } from "express";
import { compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { UserModel } from "../../models/userModels";
import { JWT_SECRET } from "../../shared/config/secrets";
import { AppError } from "../../shared/helpers/AppError";
import { loginSchema } from "../../schema/loginSchema";
import { ZodError } from "zod";
import { handleZodError } from "../../shared/helpers/errorHandler";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    loginSchema.parse(req.body);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return next(handleZodError(error));
    }
    return next(new AppError("An unknown validation error occurred.", 400));
  }

  try {
    const { email, password } = req.body;

    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
      return next(new AppError("User not found", 404));
    }

    if (!compareSync(password, findUser.password)) {
      return next(new AppError("Invalid password", 401));
    }

    const token = jwt.sign(
      {
        userId: findUser.id,
        email: findUser.email,
        role: findUser.role,
        name: findUser.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      data: { token },
      message: "User logged in successfully",
      status: 200,
    });
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    return next(new AppError("Internal Server Error", 500));
  }
};
