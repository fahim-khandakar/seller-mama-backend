import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../shared/helpers/AppError";
import { ZodError } from "zod";
import { handleZodError } from "../../shared/helpers/errorHandler";
import { ProductModel } from "../../models/productModel";
import { productSchema } from "../../schema/productSchema";

/** ✅ Edit Product */
export const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    productSchema.partial().parse(req.body);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return next(handleZodError(error));
    }
    return next(new AppError("Validation error", 400));
  }

  const { id } = req.params;
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new AppError("Product not found", 404));
    }

    res.json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
      status: 200,
    });
  } catch (error) {
    return next(new AppError("Internal Server Error", 500));
  }
};
