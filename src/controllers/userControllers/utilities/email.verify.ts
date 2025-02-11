import catchAsync from "../../../shared/helpers/catchAsync";
import sendResponse from "../../../shared/helpers/sendResponse";
import { Request, Response } from "express";
import { verifyCode } from "./email.utility";
import { updateVerificationStatus } from "../updateVerification";

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, code } = req.body;
  console.log("email", email, "code", code);
  if (!email || !code) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Email and verification code are required",
    });
  }

  const isValid = verifyCode(email, code);

  if (!isValid) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid or expired verification code",
    });
  }

  await updateVerificationStatus(email, true);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Email verified successfully",
  });
});
