import { z } from "zod";
import { ENUM_COUPON_STATUS, ENUM_COUPON_TYPE } from "../../../enums/coupon";

/**
 * 🔥 Create Coupon Validation
 */
export const createCouponZodSchema = z.object({
  code: z
    .string({
      error: "Coupon code is required",
    })
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code cannot exceed 20 characters")
    .toUpperCase(),

  type: z.enum(Object.values(ENUM_COUPON_TYPE) as [string, ...string[]], {
    error: "Coupon type is required",
  }),

  value: z
    .number({
      error: "Coupon value is required",
    })
    .min(1, "Coupon value must be greater than 0"),

  minOrderAmount: z
    .number()
    .min(0, "Minimum order must be positive")
    .optional(),

  maxDiscountAmount: z
    .number()
    .min(0, "Max discount must be positive")
    .optional(),

  usageLimit: z
    .number()
    .int()
    .min(1, "Usage limit must be at least 1")
    .optional(),

  validFrom: z.coerce.date({
    error: "Valid from date is required",
  }),

  validUntil: z.coerce.date({
    error: "Valid until date is required",
  }),
});
export const updateCouponZodSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase().optional(),

  type: z
    .enum(Object.values(ENUM_COUPON_TYPE) as [string, ...string[]])
    .optional(),

  value: z.number().min(1).optional(),

  minOrderAmount: z.number().min(0).optional(),

  maxDiscountAmount: z.number().min(0).optional(),

  usageLimit: z.number().int().min(1).optional(),

  status: z
    .enum(Object.values(ENUM_COUPON_STATUS) as [string, ...string[]])
    .optional(),

  validFrom: z.coerce.date().optional(),

  validUntil: z.coerce.date().optional(),
});
