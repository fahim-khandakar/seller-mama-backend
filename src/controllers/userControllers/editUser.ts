import type { NextFunction, Request, Response } from "express";
import { UserModel } from "../../models/userModels";
import { hashSync } from "bcrypt";
import { userSchema } from "../../schema/userSchema";
import { AppError } from "../../shared/helpers/AppError";
import { ZodError } from "zod";
import { handleZodError } from "../../shared/helpers/errorHandler";

export const editUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    userSchema.partial().parse(req.body);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return next(handleZodError(error));
    }
    return next(new AppError("An unknown validation error occurred.", 400));
  }

  const { id } = req.params;
  const { email, name, password, phone } = req.body;

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Check if the new email already exists (excluding the current user)
    if (email && email !== user.email) {
      const emailExists = await UserModel.findOne({ email });
      if (emailExists) {
        return next(new AppError("Email is already in use", 400));
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) user.password = hashSync(password, 10);

    await user.save();

    // Exclude password from response
    const { password: _, ...userResponse } = user.toObject();

    res.json({
      success: true,
      data: { user: userResponse },
      message: "User updated successfully",
      status: 200,
    });
  } catch (error) {
    return next(new AppError("Internal Server Error", 500));
  }
};
