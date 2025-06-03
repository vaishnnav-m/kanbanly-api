export interface IEmailUtils {
  sendEmail(
    to: string,
    subject: string,
    body: string
  ): Promise<void>;
}
