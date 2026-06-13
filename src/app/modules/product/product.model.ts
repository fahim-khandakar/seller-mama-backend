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
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    mainCategory: {
      type: Schema.Types.ObjectId,
      ref: "MainCategory",
      required: true,
    },
    mainCategorySlug: { type: String, required: true },
    categorySlug: { type: String, required: true },
    typeSlug: { type: String, required: true },
    sizeChartImage: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

export const Product = model<IProduct>("Product", productSchema);
