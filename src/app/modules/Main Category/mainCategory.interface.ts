import { Types } from "mongoose";

export interface IMainCategory {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}
