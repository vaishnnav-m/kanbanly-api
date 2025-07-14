export const ACCOUNT_VERIFICATION = (verificationLink: string) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h1 style="color: #5cb85c;">Account Verification</h1>
    <p>Thank you for registering with Kanbanly. Please click the button below to verify your account:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationLink}" style="background-color: #5cb85c; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
        Verify My Account
      </a>
    </div>

    <p>If the button above does not work, you can also copy and paste the following link into your browser:</p>
    <p style="word-break: break-all;"><a href="${verificationLink}">${verificationLink}</a></p>

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

export const WORKSPACE_INVITATION = (
  workspaceName: string,
  role: string,
  invitationLink: string
) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h1 style="color: #0275d8;">You're Invited to Join ${workspaceName}</h1>
    <p>You have been invited to join the workspace <strong>${workspaceName}</strong> on Kanbanly as a <strong>${role}</strong>.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${invitationLink}" style="background-color: #0275d8; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
        Accept Invitation
      </a>
    </div>

    <p>If the button above doesn't work, copy and paste the link below into your browser:</p>
    <p style="word-break: break-all;"><a href="${invitationLink}">${invitationLink}</a></p>

    <p>If you weren't expecting this invitation, you can safely ignore this email.</p>
    <p style="margin-top: 20px;">Looking forward to collaborating with you!</p>
    <p><strong>The Kanbanly Team</strong></p>
  </div>
`;
