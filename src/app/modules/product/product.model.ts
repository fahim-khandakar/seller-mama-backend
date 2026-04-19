import mongoose, { Schema, model } from "mongoose";
import { IProduct, IStockEntry } from "./product.interface";

const stockEntrySchema = new Schema<IStockEntry>({
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  remainingQuantity: { type: Number, default: 0 },
});

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    basePrice: { type: Number, required: true },
    discountPrice: { type: Number },
    stock: [stockEntrySchema],
    totalStock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

// Pre-save middleware to calculate totalStock
productSchema.pre<IProduct>("save", function () {
  this.totalStock = this.stock.reduce(
    (total, entry) => total + entry.remainingQuantity,
    0,
  );
});

export const Product = model<IProduct>("Product", productSchema);
