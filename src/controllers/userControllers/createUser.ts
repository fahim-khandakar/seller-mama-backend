import type { NextFunction, Request, Response } from "express";
import { UserModel } from "../../models/userModels";
import { hashSync } from "bcrypt";
import { userSchema } from "../../schema/userSchema";
import { AppError } from "../../shared/helpers/AppError";
import { ZodError } from "zod";
import { handleZodError } from "../../shared/helpers/errorHandler";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    userSchema.parse(req.body);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return next(handleZodError(error));
    }
    return next(new AppError("An unknown validation error occurred.", 400));
  }

  const { email, name, password } = req.body;

  try {
    const findUser = await UserModel.findOne({ email });

    if (findUser) {
      return next(new AppError("User already exists", 400));
    }

    const hashedPassword = hashSync(password, 10);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Destructure password from the object to exclude it
    const { password: _, ...userResponse } = newUser.toObject();

    res.status(201).json({
      status: "success",
      data: {
        user: userResponse,
      },
      message: "User created successfully",
    });
  } catch (error) {
    return next(new AppError("Internal Server Error", 500));
  }
};
