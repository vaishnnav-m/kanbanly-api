import { inject, injectable } from "tsyringe";
import { IVerificationService } from "../types/service-interface/IVerificationService";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { ITokenService } from "../types/service-interface/ITokenService";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { config } from "../config";
import { IEmailService } from "../types/service-interface/IEmailService";
import { AppEvent, appEvents } from "../events/app.events";
import { ProcessVerificationResponseDto } from "../types/dtos/users/user-response.dto";
import { IPreferenceService } from "../types/service-interface/IPreferenceService";

@injectable()
export class VerificationService implements IVerificationService {
  private _frontendUrl: string;
  constructor(
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("ITokenService") private _tokenService: ITokenService,
    @inject("IUserRepository") private _userRepository: IUserRepository,
    @inject("IPreferenceService") private _preferenceService: IPreferenceService
  ) {
    this._frontendUrl = config.cors.ALLOWED_ORIGIN;
  }

  async sendVerificationEmail(toEmail: string): Promise<void> {
    const isEmailExists = await this._userRepository.findByEmail(toEmail);
    if (!isEmailExists || isEmailExists.isEmailVerified) {
      throw new AppError(
        ERROR_MESSAGES.USER_NOT_EXIST_OR_ALREADY_VERIFIED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const token = this._tokenService.generateEmailToken({ email: toEmail });

    const verificationLink = `${this._frontendUrl}/verify-email?token=${token}`;

    this._emailService.sendVerificationEmail(
      toEmail,
      "Verify Your Email Address",
      verificationLink
    );
  }

  async processVerification(
    token: string
  ): Promise<ProcessVerificationResponseDto> {
    const userEmail = this._tokenService.verifyEmailToken(token);
    if (!userEmail) {
      throw new AppError(
        "Invalid or expired verification link.",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const user = await this._userRepository.findByEmail(userEmail.email);

    if (!user) {
      throw new AppError(
        "User not found for this verification link.",
        HTTP_STATUS.NOT_FOUND
      );
    }
    if (user.isEmailVerified) {
      throw new AppError("Email is already verified.", HTTP_STATUS.BAD_REQUEST);
    }

    const newUser = await this._userRepository.updateIsVerified(
      userEmail.email,
      true
    );

    if (!newUser) {
      throw new AppError(
        "Email verification failed",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    await this._preferenceService.createPreferences(newUser.userId);

    appEvents.emit(AppEvent.EmailVerified, { userId: newUser.userId });

    return {
      userId: newUser.userId,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      profile: newUser.profile,
      isAdmin: newUser.isAdmin,
    };
  }
}
