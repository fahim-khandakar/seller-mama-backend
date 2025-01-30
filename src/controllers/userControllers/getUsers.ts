import { Request, Response } from "express";
import { UserModel } from "../../models/userModels";

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
