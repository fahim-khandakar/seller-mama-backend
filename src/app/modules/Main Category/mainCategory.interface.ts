import { Types } from "mongoose";

export interface IMainCategory {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
