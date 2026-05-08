import { ENUM_COUPON_STATUS, ENUM_COUPON_TYPE } from "../../../enums/coupon";
import { Coupon } from "./coupon.model";

export const applyCouponLogic = async (code: string, orderAmount: number) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });
  console.log("code", code, "amount", orderAmount);
  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  const amount = Number(orderAmount);
  const value = Number(coupon.value);

  if (isNaN(amount) || isNaN(value)) {
    throw new Error("Invalid numeric data");
  }

  if (coupon.status !== ENUM_COUPON_STATUS.ACTIVE) {
    throw new Error("Coupon is not active");
  }

  const now = new Date();

  if (now < coupon.validFrom || now > coupon.validUntil) {
    throw new Error("Coupon expired");
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  if (coupon.minOrderAmount && amount < coupon.minOrderAmount) {
    throw new Error(`Minimum order amount is ${coupon.minOrderAmount}`);
  }

  let discount = 0;

  if (coupon.type === ENUM_COUPON_TYPE.PERCENTAGE) {
    discount = (amount * value) / 100;

    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else {
    discount = value;
  }

  if (discount > amount) {
    discount = amount;
  }

  return {
    discount,
    coupon,
  };
};

export const validateCoupon = async (code: string, orderAmount: number) => {
  const { discount, coupon } = await applyCouponLogic(code, orderAmount);

  return {
    discount,
    finalAmount: orderAmount - discount,
    couponId: coupon._id,
  };
};
