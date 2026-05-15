import { Schema, model } from "mongoose";
import { IOrder, IOrderItem } from "./order.interface";
import { ENUM_ORDER_STATUS } from "../../../enums/order";

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  productSize: { type: String },
  sellPrice: { type: Number, required: true },
  purchasePrice: { type: Number },
  nameAndNumber: { type: String },
});

const orderSchema = new Schema<IOrder>(
  {
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    customerEmail: { type: String },
    transactionId: { type: String, required: true },
    paymentMethod: {
      type: String,
      default: "BKASH",
      enum: ["BKASH", "ROCKET", "NAGAD", "CARD", "CASH"],
    },
    status: {
      type: String,
      enum: ENUM_ORDER_STATUS,
      default: ENUM_ORDER_STATUS.PENDING,
    },
    soldBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
  },
  {
    timestamps: true,
  },
);

export const Order = model<IOrder>("Order", orderSchema);
