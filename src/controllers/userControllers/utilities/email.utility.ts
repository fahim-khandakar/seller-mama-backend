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
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #2563eb; border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">Welcome to Seller Mama</h1>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #374151;">
                        Thank you for registering with Seller Mama. To ensure the security of your account, please verify your email address using the verification code below:
                      </p>
                      
                      <!-- Verification Code Box -->
                      <div style="background-color: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Your Verification Code</p>
                        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #2563eb;">
                          ${code}
                        </div>
                      </div>
                      
                      <p style="margin: 0 0 10px 0; font-size: 16px; line-height: 1.5; color: #374151;">
                        This code will expire in <span style="font-weight: 600; color: #dc2626;">5 minutes</span>.
                      </p>
                      
                      <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #374151;">
                        If you didn't request this verification, please ignore this email or contact our support team immediately.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
                        This is an automated message, please do not reply.
                      </p>
                      <p style="margin: 0; font-size: 14px; color: #6b7280;">
                        &copy; ${new Date().getFullYear()} NEC Group. All rights reserved.
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
