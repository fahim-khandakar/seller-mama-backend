import { NextFunction, Request, Response } from "express";
import { UserModel } from "../../models/userModels";
import { hashSync } from "bcrypt";
import { userSchema } from "../../schema/userSchema";
import { AppError } from "../../shared/helpers/AppError";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Zod validation
  try {
    userSchema.parse(req.body);
  } catch (error) {
    return next(new AppError("Validation Error", 400));
  }

  const { email, name, password } = req.body;

  try {
    const findUser = await UserModel.findOne({
      email: email,
    });

    if (findUser) {
      return next(new AppError("User already exists", 400));
    }

    const hashedPassword = hashSync(password, 10);

    const newUser = new UserModel({ name, email, password: hashedPassword });

    await newUser.save();

    res.json({
      status: 200,
      data: newUser,
      message: "User created successfully",
    });
  } catch (error) {
    return next(new AppError("Internal Server Error", 500));
  }
};
