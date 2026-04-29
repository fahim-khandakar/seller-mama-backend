import { Types } from "mongoose";

export interface IType {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}
