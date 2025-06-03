import { injectable } from "tsyringe";
import { IOtpRepository } from "../types/repository-interfaces/IOtpRepository";
import { IOtp } from "../types/IOtp";
import { otpModel } from "../models/otp.model";
import { OtpDto } from "../types/dtos/createOtp.dto";

@injectable()
export class OtpRepository implements IOtpRepository {
  async generateOtp(data: OtpDto): Promise<IOtp> {
    return await otpModel.create(data);
  }
  async findByEmail(email: string): Promise<IOtp | null> {
    return await otpModel.findOne({ email });
  }
  async delete(id: string): Promise<void> {
    await otpModel.findByIdAndDelete(id);
  }
}
