import mongoose, { Schema, model } from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    images: [{ type: String }],
    description: [{ type: String }],
    details: { type: String },
    basePrice: { type: Number, required: true },
    discountPrice: { type: Number },
    totalStock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: Schema.Types.ObjectId, ref: "Type", required: true },
  },
  {
    timestamps: true,
  },
);

export const Product = model<IProduct>("Product", productSchema);
