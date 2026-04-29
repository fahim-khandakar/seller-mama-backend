import { Types } from "mongoose";

export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  mainCategory: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
