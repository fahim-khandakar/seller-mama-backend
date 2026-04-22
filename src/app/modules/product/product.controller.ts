import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { ProductServices } from "./product.service";
import { ProductValidations } from "./product.validation";
import { validateRequest } from "../../../app/middlewares/validateRequest";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  // Validate that images are provided
  if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "At least one product image is required",
      data: null,
    });
  }

  const validatedData = ProductValidations.createProductValidation.parse(
    req.body,
  );
  const userId = (req.user as JwtPayload).userId as string;

  const result = await ProductServices.createProduct(
    validatedData,
    userId,
    req.files as Express.Multer.File[],
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.getAllProducts(
    req.query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ProductServices.getSingleProduct(productId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result.data,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const validatedData = ProductValidations.updateProductValidation.parse(
    req.body,
  );
  const userId = (req.user as JwtPayload).userId as string;

  const result = await ProductServices.updateProduct(
    productId as string,
    validatedData,
    userId,
    req.files as Express.Multer.File[] | undefined,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const userId = (req.user as JwtPayload).userId as string;

  const result = await ProductServices.deleteProduct(
    productId as string,
    userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,

  updateProduct,
  deleteProduct,
};
