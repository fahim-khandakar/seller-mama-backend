import { Types } from "mongoose";
import { TCouponStatus, TCouponType } from "../../../enums/coupon";

export interface ICoupon {
  code: string;
  type: TCouponType;
  value: number;

  minOrderAmount?: number;
  maxDiscountAmount?: number;

  usageLimit?: number;
  usedCount: number;

  validFrom: Date;
  validUntil: Date;

  status: TCouponStatus;

  createdBy: Types.ObjectId;
}
