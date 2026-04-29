import { Schema, model } from "mongoose";
import { IMainCategory } from "./mainCategory.interface";

const mainCategorySchema = new Schema<IMainCategory>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const MainCategory = model<IMainCategory>(
  "MainCategory",
  mainCategorySchema,
);
