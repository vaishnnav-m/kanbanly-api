import { OtpDto } from "../dtos/createOtp.dto";
import { IOtp } from "../IOtp";

export interface IOtpRepository {
   generateOtp(otp: OtpDto): Promise<IOtp>;
   findByEmail(email: string): Promise<IOtp | null>;
}
