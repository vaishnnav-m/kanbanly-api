export interface IOtpService {
  sendOtp(email: string): Promise<void>;
  verifyOtpService(email: string, otp: string): Promise<void>;
}
