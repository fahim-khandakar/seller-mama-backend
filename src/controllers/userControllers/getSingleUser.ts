import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../../shared/helpers/AppError";
import { UserModel } from "../../models/userModels";

export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.id;

    if (!Types.ObjectId.isValid(userId)) {
      return next(new AppError("Invalid user ID", 400));
    }

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      success: true,
      data: user,
      message: "User fetched successfully",
      status: 200,
    });
  } catch (error) {
    return next(new AppError("Internal Server Error", 500));
  }
};
