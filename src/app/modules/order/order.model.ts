import { Schema, model } from "mongoose";
import { IOrder, IOrderItem } from "./order.interface";

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  sellPrice: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  nameAndNumber: { type: String },
});

const orderSchema = new Schema<IOrder>(
  {
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    customerEmail: { type: String },
    transactionId: { type: String },
    paymentMethod: {
      type: String,
      default: "BKASH",
      enum: ["BKASH", "ROCKET", "NAGAD", "CARD", "CASH"],
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "IN_PROGRESS",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PENDING",
    },
    soldBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

export const Order = model<IOrder>("Order", orderSchema);
