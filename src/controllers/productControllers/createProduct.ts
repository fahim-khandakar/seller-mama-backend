import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../shared/helpers/AppError";
import { ZodError } from "zod";
import { handleZodError } from "../../shared/helpers/errorHandler";
import { ProductModel } from "../../models/productModel";
import { productSchema } from "../../schema/productSchema";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    productSchema.parse(req.body); // Validate request body
  } catch (error: any) {
    if (error instanceof ZodError) {
      return next(handleZodError(error));
    }
    return next(new AppError("An unknown validation error occurred.", 400));
  }

  const {
    name,
    description,
    price,
    category,
    stock,
    images,
    brand,
    createdBy,
  } = req.body;

  try {
    const newProduct = await ProductModel.create({
      name,
      description,
      price,
      category,
      stock,
      images,
      brand,
      createdBy,
    });

    res.status(201).json({
      success: true,
      data: newProduct,
      message: "Product created successfully",
    });
  } catch (error) {
    return next(new AppError("Internal Server Error", 500));
  }
};
