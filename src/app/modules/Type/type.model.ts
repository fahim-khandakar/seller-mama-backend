import { Schema, model } from "mongoose";
import { IType } from "./type.interface";

const typeSchema = new Schema<IType>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
  },
  {
    timestamps: true,
  },
);

export const Type = model<IType>("Type", typeSchema);
