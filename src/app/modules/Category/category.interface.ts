import { Types } from "mongoose";

export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  sizeChartImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
