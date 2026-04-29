import { Schema, model } from "mongoose";
import { IType } from "./type.interface";

const typeSchema = new Schema<IType>(
  {
    name: { type: String, required: true },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
    },
  },
  {
    timestamps: true,
  },
);

export const Type = model<IType>("Type", typeSchema);
