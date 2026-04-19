import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { AnalyticsServices } from "./analytics.service";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";

const getSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getSummary(
    req.query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Analytics summary retrieved successfully",
    data: result,
  });
});

export const AnalyticsControllers = {
  getSummary,
};
