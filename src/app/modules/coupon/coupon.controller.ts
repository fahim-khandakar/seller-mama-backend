import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { CouponService } from "./coupon.service";
import { validateCoupon } from "./coupon.utils";

/**
 * 🔹 Create Coupon
 */
const createCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;

    const result = await CouponService.createCoupon(req.body, user.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Coupon created successfully",
      data: result,
    });
  },
);

const validCoupon = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await validateCoupon(data?.code, data?.orderAmount);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon applied successfully 🎉",
    data: result,
  });
});
const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.getAllCoupons();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupons retrieved successfully",
    data: result,
  });
});
const getSingleCoupon = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CouponService.getById(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon retrieved successfully",
    data: result,
  });
});

/**
 * 🔹 Update Coupon
 */
const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CouponService.updateCoupon(id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon updated successfully",
    data: result,
  });
});

/**
 * 🔹 Delete / Deactivate Coupon
 */
const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CouponService.deleteCoupon(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon deactivated successfully",
    data: result,
  });
});

export const CouponControllers = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getSingleCoupon,
  validCoupon,
};
