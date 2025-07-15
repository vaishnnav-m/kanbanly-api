export interface IEmailService {
  sendVerificationEmail(
    to: string,
    subject: string,
    body: string
  ): Promise<void>;

  sendInvitationEmail(
    to: string,
    workspaceName: string,
    role: string,
    link: string
  ): Promise<void>;
}
