import { IUser } from "../IUser";

export interface IVerificationService {
  sendVerificationEmail(toEmail: string): Promise<void>;
  processVerification(token: string): Promise<IUser>;
}
