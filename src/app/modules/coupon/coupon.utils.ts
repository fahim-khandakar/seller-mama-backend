import { ENUM_COUPON_STATUS, ENUM_COUPON_TYPE } from "../../../enums/coupon";
import { Coupon } from "./coupon.model";

export const applyCouponLogic = async (code: string, orderAmount: number) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });

  if (!coupon) {
    throw new Error("Invalid coupon code");
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

  if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
    throw new Error(`Minimum order amount is ${coupon.minOrderAmount}`);
  }

  let discount = 0;

  if (coupon.type === ENUM_COUPON_TYPE.PERCENTAGE) {
    discount = (orderAmount * coupon.value) / 100;

    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else {
    discount = coupon.value;
  }

  if (discount > orderAmount) {
    discount = orderAmount;
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
