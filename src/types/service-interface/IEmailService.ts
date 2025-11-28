export interface IEmailService {
  sendVerificationEmail(
    to: string,
    subject: string,
    link: string
  ): Promise<void>;

  sendForgotEmail(
    to: string,
    subject: string,
    link: string,
    name: string
  ): Promise<void>;

  sendInvitationEmail(
    to: string,
    workspaceName: string,
    role: string,
    link: string
  ): Promise<void>;

  sendMentionEmail(
    to: string,
    commenterName: string,
    taskTitle: string
  ): Promise<void>;
}
