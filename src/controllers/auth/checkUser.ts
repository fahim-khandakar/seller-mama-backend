import { Response, Request } from "express";

export const me = async (req: Request, res: Response): Promise<void> => {
  res.json(req.user);
};
