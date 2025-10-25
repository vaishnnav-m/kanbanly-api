import { ProcessVerificationResponseDto } from "../dtos/users/user-response.dto";

export interface IVerificationService {
  sendVerificationEmail(toEmail: string): Promise<void>;
  processVerification(token: string): Promise<ProcessVerificationResponseDto>;
}
