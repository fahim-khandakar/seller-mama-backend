import type { NextFunction, Request, Response } from "express";
import { UserModel } from "../../models/userModels";
import { hashSync } from "bcrypt";
import { userSchema } from "../../schema/userSchema";
import { AppError } from "../../shared/helpers/AppError";
import { ZodError } from "zod";
import { handleZodError } from "../../shared/helpers/errorHandler";

export const createUserByAdmin = async (
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

  const { email, name, password, phone, role } = req.body;

  // Ensure role is either "ADMIN" or "USER"
  if (!["ADMIN", "USER"].includes(role)) {
    return next(new AppError("Invalid role. Must be 'ADMIN' or 'USER'.", 400));
  }

  try {
    const findUser = await UserModel.findOne({ email });

    if (findUser) {
      return next(new AppError("User already exists", 400));
    }

    const hashedPassword = hashSync(password, 10);
    const newUser = await UserModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role.toUpperCase(), // Ensure role is stored in uppercase
    });

    // Remove password from response
    const { password: _, ...userResponse } = newUser.toObject();

    res.json({
      success: true,
      data: {
        user: userResponse,
      },
      message: "User created successfully",
      status: 201,
    });
  } catch (error) {
    return next(new AppError("Internal Server Error", 500));
  }
};
