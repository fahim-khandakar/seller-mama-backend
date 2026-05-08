import { ENUM_COUPON_STATUS, ENUM_COUPON_TYPE } from "../../../enums/coupon";
import { ICoupon } from "./coupon.interface";
import { Coupon } from "./coupon.model";

const createCoupon = async (payload: Partial<ICoupon>, adminId: string) => {
  return await Coupon.create({
    ...payload,
    createdBy: adminId,
  });
};

const updateCoupon = async (id: string, payload: Partial<ICoupon>) => {
  return await Coupon.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};
const getById = async (id: string) => {
  return await Coupon.findById(id);
};

const getAllCoupons = async () => {
  return await Coupon.find().populate("createdBy", "name email");
};

const deleteCoupon = async (id: string) => {
  return await Coupon.findByIdAndUpdate(
    id,
    { status: "INACTIVE" },
    { new: true },
  );
};

export const CouponService = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getById,
};
