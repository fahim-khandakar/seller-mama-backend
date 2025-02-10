import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../../shared/helpers/AppError";
import { ProductModel } from "../../models/productModel";

/** ✅ Delete Product */
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = req.params.id;

    if (!Types.ObjectId.isValid(productId)) {
      return next(new AppError("Invalid product ID", 400));
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return next(new AppError("Product not found", 404));
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
      status: 200,
    });
  } catch (error) {
    return next(new AppError("Internal Server Error", 500));
  }
};
