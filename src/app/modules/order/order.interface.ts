import { Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  sellPrice: number;
  purchasePrice: number; // for profit calculation
  nameAndNumber?: string;
  productSize?: string;
}

export interface IOrder {
  _id?: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
  paidAmount?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  transactionId: string;
  paymentMethod?: "BKASH" | "ROCKET" | "NAGAD" | "CARD" | "CASH";
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  soldBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
