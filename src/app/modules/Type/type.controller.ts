import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { TypeServices } from "./type.service";

const createType = catchAsync(async (req: Request, res: Response) => {
  const result = await TypeServices.createType(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Type created successfully",
    data: result,
  });
});

const getAllTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await TypeServices.getAllTypes(
    req.query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Types retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TypeServices.getSingleType(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Type retrieved successfully",
    data: result,
  });
});

const updateType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TypeServices.updateType(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Type updated successfully",
    data: result,
  });
});

const deleteType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await TypeServices.deleteType(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Type deleted successfully",
    data: null,
  });
});

export const TypeControllers = {
  createType,
  getAllTypes,
  getSingleType,
  updateType,
  deleteType,
};
