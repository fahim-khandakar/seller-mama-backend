import { Request, Response } from "express";
import sendResponse from "../../shared/helpers/sendResponse";
import {
  generateVerificationCode,
  sendVerificationEmail,
  storeVerificationCode,
} from "./utilities/email.utility";

export const resendMail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Email is required.",
      });
    }

    const verificationCode = generateVerificationCode();
    storeVerificationCode(email, verificationCode);

    const emailSent = await sendVerificationEmail(email, verificationCode);

    if (emailSent) {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Verification email sent successfully.",
      });
    } else {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Failed to send verification email.",
      });
    }
  } catch (error) {
    console.error("Error in resendMail:", error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Internal server error.",
    });
  }
};
