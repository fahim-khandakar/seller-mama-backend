import { emailConfig } from "../config/constants";

// Store verification codes in memory (use Redis in production)
const verificationStore = new Map<string, { code: string; expires: number }>();

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeVerificationCode = (email: string, code: string): void => {
  const expires = Date.now() + emailConfig.verificationExpiry;
  verificationStore.set(email, { code, expires });

  // Cleanup after expiry
  setTimeout(() => {
    verificationStore.delete(email);
  }, emailConfig.verificationExpiry);
};

export const verifyCode = (email: string, code: string): boolean => {
  const stored = verificationStore.get(email);

  if (!stored) {
    return false;
  }

  if (Date.now() > stored.expires) {
    verificationStore.delete(email);
    return false;
  }

  return stored.code === code;
};

export const sendVerificationEmail = async (
  to: string,
  code: string
): Promise<boolean> => {
  const emailTemplate = {
    from: emailConfig.from,
    to,
    subject: "Welcome to Seller Mama - Email Verification Required",
    html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Seller Mama - Email Verification</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; padding: 20px 0;">
              <tr>
                <td align="center">
                  <table role="presentation" style="width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #4f73b5; padding: 30px 40px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0;">Welcome to Seller Mama!</h1>
                      </td>
                    </tr>
  
                    <!-- Main Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 20px;">
                          Thanks for registering with <strong>Seller Mama</strong>. To complete your registration, please verify your email by using the verification code below.
                        </p>
                        
                        <!-- Verification Code Box -->
                        <div style="background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 30px; margin: 20px 0; text-align: center;">
                          <p style="font-size: 14px; color: #868e96; margin-bottom: 10px;">Your Verification Code</p>
                          <div style="font-size: 32px; font-weight: 700; color: #4f73b5; letter-spacing: 8px;">
                            ${code}
                          </div>
                        </div>
                        
                        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 10px;">
                          This code will expire in <span style="font-weight: bold; color: #e53e3e;">5 minutes</span>.
                        </p>
                        <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                          If you didn’t request this, please ignore this email or contact our support team immediately.
                        </p>
                      </td>
                    </tr>
  
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 20px 40px; text-align: center; border-top: 1px solid #dee2e6;">
                        <p style="font-size: 14px; color: #868e96; margin: 0;">
                          This is an automated message, please do not reply.
                        </p>
                        <p style="font-size: 14px; color: #868e96; margin: 0;">
                          &copy; ${new Date().getFullYear()} Seller Mama. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
  };

  try {
    await emailConfig.smtp.sendMail(emailTemplate);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};
