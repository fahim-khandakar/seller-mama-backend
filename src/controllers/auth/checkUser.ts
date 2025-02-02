import { Response, Request } from "express";

export const me = async (req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    data: req.user,
    message: "User fetched successfully",
    status: 200,
  });
};
