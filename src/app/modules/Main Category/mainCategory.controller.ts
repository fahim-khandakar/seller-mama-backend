import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { MainCategoryServices } from "./mainCategory.service";

const createMainCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await MainCategoryServices.createMainCategory(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Main Category created successfully",
    data: result,
  });
});

const getAllMainCategories = catchAsync(async (req: Request, res: Response) => {
  console.log("req", req.query);
  const result = await MainCategoryServices.getAllMainCategories(
    req.query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Main Categories retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleMainCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MainCategoryServices.getSingleMainCategory(
      id as string,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Main Category retrieved successfully",
      data: result,
    });
  },
);

const updateMainCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MainCategoryServices.updateMainCategory(
    id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Main Category updated successfully",
    data: result,
  });
});

const deleteMainCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await MainCategoryServices.deleteMainCategory(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Main Category deleted successfully",
    data: null,
  });
});

export const MainCategoryControllers = {
  createMainCategory,
  getAllMainCategories,
  getSingleMainCategory,
  updateMainCategory,
  deleteMainCategory,
};
