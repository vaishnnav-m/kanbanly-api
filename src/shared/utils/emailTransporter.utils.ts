import nodemailer from "nodemailer";
import { injectable } from "tsyringe";
import { IEmailUtils } from "../../types/common/IEmailUtils";
import { config } from "../../config";
import { ACCOUNT_VERIFICATION } from "../templates/email.templates";

@injectable()
export class EmailUtils implements IEmailUtils {
  private _transporter;
  constructor() {
    this._transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.nodeMailer.EMAIL_USER,
        pass: config.nodeMailer.EMAIL_PASS,
      },
    });
  }
  async sendEmail(to: string, subject: string, otp: string): Promise<void> {
    const mailOptions = {
      from: "Kanbanly",
      to,
      subject,
      html: ACCOUNT_VERIFICATION(otp),
    };

    await this._transporter.sendMail(mailOptions);
  }
}
