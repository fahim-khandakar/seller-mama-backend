import { Types } from "mongoose";

export interface IStockEntry {
  _id?: Types.ObjectId;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  remainingQuantity: number; // for FIFO tracking
}

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  discountPrice?: number;
  stock: IStockEntry[];
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

export interface IAnalytics {
  _id?: Types.ObjectId;
  user: Types.ObjectId; // seller
  product: Types.ObjectId;
  order: Types.ObjectId;
  quantity: number;
  sellPrice: number;
  purchasePrice: number; // from stock entry
  profit: number;
  date: Date;
}
