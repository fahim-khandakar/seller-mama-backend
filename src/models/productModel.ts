import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  brand?: string;
  ratings: {
    user: mongoose.Types.ObjectId;
    rating: number;
    review?: string;
  }[];
  averageRating: number;
  sold: number;
  createdBy: mongoose.Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String, required: true }],
    brand: { type: String },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String },
      },
    ],
    averageRating: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ProductModel = mongoose.model<IProduct>("products", productSchema);
