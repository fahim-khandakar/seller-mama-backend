import { Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  sellPrice: number;
  stockEntry: Types.ObjectId;
  purchasePrice: number; // for profit calculation
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
  soldBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
