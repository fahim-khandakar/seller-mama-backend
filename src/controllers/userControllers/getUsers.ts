import { Request, Response } from "express";
import { UserModel } from "../../models/userModels";

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().select("-password");
    res.json({
      success: true,
      data: users,
      message: "Users fetched successfully",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
