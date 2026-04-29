import { Types } from "mongoose";

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  description?: string[];
  details?: string;
  images?: string[];
  basePrice: number;
  discountPrice?: number;
  totalStock: number; // calculated field
  isActive: boolean;
  createdBy: Types.ObjectId; // user who created
  type: Types.ObjectId; // user who created
  category: Types.ObjectId; // user who created
  mainCategory: Types.ObjectId; // user who created
  mainCategorySlug: string;
  categorySlug: string;
  typeSlug: string;
  createdAt?: Date;
  updatedAt?: Date;
}
