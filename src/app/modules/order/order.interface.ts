import { Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  sellPrice: number;
  stockEntry: Types.ObjectId;
  purchasePrice: number; // for profit calculation
  nameAndNumber?: string;
}

export interface IOrder {
  _id?: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  transactionId?: string;
  paymentMethod?: "BKASH" | "ROCKET" | "NAGAD" | "CARD" | "CASH";
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  soldBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
