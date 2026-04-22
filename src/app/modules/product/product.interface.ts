import { Types } from "mongoose";

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  description?: string[];
  images?: string[];
  category: string;
  basePrice: number;
  discountPrice?: number;
  totalStock: number; // calculated field
  isActive: boolean;
  createdBy: Types.ObjectId; // user who created
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  sellPrice: number; // price at which sold
  stockEntry: Types.ObjectId; // which stock entry was used
}

export interface IOrder {
  _id?: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  soldBy: Types.ObjectId; // admin/moderator who sold
  createdAt?: Date;
  updatedAt?: Date;
}
