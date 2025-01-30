import { Request, Response } from "express";
import { UserModel } from "../../models/userModels";

// Create new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const newUser = new UserModel({ name, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};
