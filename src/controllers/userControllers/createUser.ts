import type { NextFunction, Request, Response } from "express";
import { UserModel } from "../../models/userModels";
import { hashSync } from "bcrypt";
import { userSchema } from "../../schema/userSchema";
import { AppError } from "../../shared/helpers/AppError";
import { ZodError } from "zod";
import { handleZodError } from "../../shared/helpers/errorHandler";
import {
  generateVerificationCode,
  sendVerificationEmail,
  storeVerificationCode,
} from "./utilities/email.utility";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../shared/config/secrets";

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

  const { email, name, password, phone } = req.body;

  const verificationCode = generateVerificationCode();
  storeVerificationCode(email, verificationCode);
  // Send verification email
  await sendVerificationEmail(email, verificationCode);

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
    });

    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Destructure password from the object to exclude it
    const { password: _, ...userResponse } = newUser.toObject();

    res.json({
      success: true,
      data: {
        token,
      },
      message: "User created successfully",
      status: 201,
    });
  } catch (error) {
    return next(new AppError("Internal Server Error", 500));
  }
};
