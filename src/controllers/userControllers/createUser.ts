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
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
      message: "User created successfully",
    });
  } catch (error) {
    return next(new AppError("Internal Server Error", 500));
  }
};
