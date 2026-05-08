import { Schema, model } from "mongoose";
import { ICoupon } from "./coupon.interface";
import { ENUM_COUPON_STATUS, ENUM_COUPON_TYPE } from "../../../enums/coupon";

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(ENUM_COUPON_TYPE),
      required: true,
    },

    value: {
      type: Number,
      required: true,
    },

    minOrderAmount: {
      type: Number,
    },

    maxDiscountAmount: {
      type: Number,
    },

    usageLimit: {
      type: Number,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    validFrom: {
      type: Date,
      required: true,
    },

    validUntil: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ENUM_COUPON_STATUS),
      default: ENUM_COUPON_STATUS.ACTIVE,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Coupon = model<ICoupon>("Coupon", couponSchema);
