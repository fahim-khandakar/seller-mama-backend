import { Types } from "mongoose";

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  description?: string[];
  details?: string;
  images?: string[];
  category: string;
  basePrice: number;
  discountPrice?: number;
  totalStock: number; // calculated field
  isActive: boolean;
  createdBy: Types.ObjectId; // user who created
  type: Types.ObjectId; // user who created
  createdAt?: Date;
  updatedAt?: Date;
}
