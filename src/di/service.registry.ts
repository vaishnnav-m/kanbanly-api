import { container } from "tsyringe";
import { IAuthService } from "../interfaces/service-interface/IAuthService";
import { AuthService } from "../services/auth.service";
import { IOtpService } from "../interfaces/service-interface/IOtpService";
import { OtpService } from "../services/otp.service";
import { ITokenService } from "../interfaces/service-interface/ITokenService";
import { TokenService } from "../services/jwt.service";

export class ServiceRegistry {
  static registerServices(): void {
    container.register<IAuthService>("IAuthService", {
      useClass: AuthService,
    });
    container.register<IOtpService>("IOtpService", {
      useClass: OtpService,
    });
    container.register<ITokenService>("ITokenService", {
      useClass: TokenService,
    });
  }
}
