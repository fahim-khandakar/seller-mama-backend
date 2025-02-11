import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

export const emailConfig = {
  smtp: nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  }),
  from: process.env.EMAIL_FROM,
  verificationExpiry: 5 * 60 * 1000, // 5 minutes in milliseconds
};
