export const ACCOUNT_VERIFICATION = ( otp: string) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h1 style="color: #5cb85c;">Account Verification</h1>
      <p>Thank you for registering with Kanbanly. Please use the following One-Time Password (OTP) to verify your account:</p>
      <p style="font-size: 24px; font-weight: bold; text-align: center; color: #0056b3; margin: 30px 0; padding: 10px 0; border: 2px dashed #0056b3; border-radius: 5px;">${otp}</p>
      <p>Enter this OTP in the application to complete your registration.</p>
      <p>If you did not register, please ignore this email.</p>
      <p style="margin-top: 20px;">Best regards,</p>
      <p><strong>The Kanbanly Team</strong></p>
    </div>
  `;

export const WELCOME = (name: string) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h1 style="color: #0056b3;">Welcome to Kanbanly, ${name}!</h1>
      <p>We are thrilled to have you on board. Start organizing your tasks and projects with ease.</p>
      <p style="margin-top: 20px;">Best regards,</p>
      <p><strong>The Kanbanly Team</strong></p>
    </div>
  `;

export const PASSWORD_RESET = (name: string, resetLink: string) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h1 style="color: #d9534f;">Password Reset Request</h1>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <p style="text-align: center; margin: 25px 0;">
        <a href="${resetLink}" style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
      </p>
      <p>If you did not request this, please ignore this email.</p>
      <p style="margin-top: 20px;">Best regards,</p>
      <p><strong>The Kanbanly Team</strong></p>
    </div>
  `;
