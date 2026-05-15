import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { OrderServices } from "./order.service";
import { OrderValidations } from "./order.validation";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const validatedData = OrderValidations.createOrderValidation.parse(req.body);

  const userId = validatedData.soldBy ? validatedData.soldBy : undefined;

  const result = await OrderServices.createOrder(validatedData, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getAllOrders(
    req.query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await OrderServices.getSingleOrder(orderId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrieved successfully",
    data: result.data,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = OrderValidations.updateOrderStatusValidation.parse(
    req.body,
  );
  const userId = (req.user as JwtPayload).userId as string;

  const result = await OrderServices.updateOrderStatus(
    orderId as string,
    status,
    userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = (req.user as JwtPayload).userId as string;

  const result = await OrderServices.deleteOrder(orderId as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const OrderControllers = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
};
