import nodemailer from "nodemailer";
import { injectable } from "tsyringe";
import { IEmailService } from "../types/service-interface/IEmailService";
import { config } from "../config";
import {
  ACCOUNT_VERIFICATION,
  PASSWORD_RESET,
  WORKSPACE_INVITATION,
} from "../shared/templates/email.templates";

@injectable()
export class EmailService implements IEmailService {
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

  async sendVerificationEmail(
    to: string,
    subject: string,
    link: string
  ): Promise<void> {
    const mailOptions = {
      from: "Kanbanly",
      to,
      subject,
      html: ACCOUNT_VERIFICATION(link),
    };

    await this._transporter.sendMail(mailOptions);
  }

  async sendForgotEmail(
    to: string,
    subject: string,
    link: string,
    name: string
  ): Promise<void> {
    const mailOptions = {
      from: "Kanbanly",
      to,
      subject,
      html: PASSWORD_RESET(name, link),
    };

    await this._transporter.sendMail(mailOptions);
  }

  async sendInvitationEmail(
    to: string,
    workspaceName: string,
    role: string,
    link: string
  ): Promise<void> {
    const mailOptions = {
      from: "Kanbanly",
      to,
      subject: `You've been invited to join the workspace ${workspaceName}`,
      html: WORKSPACE_INVITATION(workspaceName, role, link),
    };

    await this._transporter.sendMail(mailOptions);
  }
}
