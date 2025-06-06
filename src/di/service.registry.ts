import { container } from "tsyringe";
import { IAuthService } from "../types/service-interface/IAuthService";
import { AuthService } from "../services/auth.service";
import { ITokenService } from "../types/service-interface/ITokenService";
import { TokenService } from "../services/jwt.service";
import { IVerificationService } from "../types/service-interface/IVerificationService";
import { VerificationService } from "../services/verification.service";

export class ServiceRegistry {
  static registerServices(): void {
    container.register<IAuthService>("IAuthService", {
      useClass: AuthService,
    });
    container.register<IVerificationService>("IVerificationService", {
      useClass: VerificationService,
    });
    container.register<ITokenService>("ITokenService", {
      useClass: TokenService,
    });
  }
}
