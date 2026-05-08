export const ENUM_COUPON_TYPE = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
} as const;

export type TCouponType =
  (typeof ENUM_COUPON_TYPE)[keyof typeof ENUM_COUPON_TYPE];

export const ENUM_COUPON_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  EXPIRED: "EXPIRED",
} as const;

export type TCouponStatus =
  (typeof ENUM_COUPON_STATUS)[keyof typeof ENUM_COUPON_STATUS];
