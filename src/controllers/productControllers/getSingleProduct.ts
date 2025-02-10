import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../../shared/helpers/AppError";
import { ProductModel } from "../../models/productModel";

/** ✅ Get Single Product */
export const getSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = req.params.id;

    if (!Types.ObjectId.isValid(productId)) {
      return next(new AppError("Invalid product ID", 400));
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    res.json({
      success: true,
      data: product,
      message: "Product fetched successfully",
      status: 200,
    });
  } catch (error) {
    return next(new AppError("Internal Server Error", 500));
  }
};
