import { container } from "tsyringe";
import { IUserService } from "../interfaces/service-interface/IUserService";
import { UserService } from "../services/user.service";
import { IOtpService } from "../interfaces/service-interface/IOtpService";
import { OtpService } from "../services/otp.service";

export class ServiceRegistry {
  static registerServices(): void {
    container.register<IUserService>("IUserService", {
      useClass: UserService,
    });
    container.register<IOtpService>("IOtpService", {
      useClass: OtpService,
    });
  }
}
