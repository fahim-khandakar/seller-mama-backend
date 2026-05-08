import { Router } from "express";
import { CouponControllers } from "./coupon.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createCouponZodSchema,
  updateCouponZodSchema,
} from "./coupon.validation";
import { Role } from "../user/user.interface";
import { applyCouponLogic, validateCoupon } from "./coupon.utils";

const router = Router();

/**
 * 🔥 Create Coupon (ADMIN ONLY)
 */
router.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createCouponZodSchema),
  CouponControllers.createCoupon,
);

/**
 * 🔥 Get All Coupons (ADMIN ONLY)
 */
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  CouponControllers.getAllCoupons,
);

/**
 * 🔥 Get Single Coupon (ADMIN ONLY)
 */
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  CouponControllers.getSingleCoupon,
);

/**
 * 🔥 Update Coupon (ADMIN ONLY)
 */
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateCouponZodSchema),
  CouponControllers.updateCoupon,
);

/**
 * 🔥 Delete / Deactivate Coupon (ADMIN ONLY)
 */
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  CouponControllers.deleteCoupon,
);

/**
 * 🔥 Apply Coupon (CUSTOMER / PUBLIC)
 */
router.post(
  "/apply",
  // checkAuth(...Object.values(Role)),
  CouponControllers.validCoupon,
);

export const CouponRoutes = router;
