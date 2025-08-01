import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { responseDataDto, userDto } from "../types/dtos/auth/createUser.dto";
import { IAuthService } from "../types/service-interface/IAuthService";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { IBcryptUtils } from "../types/common/IBcryptUtils";
import { IUser } from "../types/entities/IUser";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { IGoogleService } from "../types/service-interface/IGoogleService";
import { ITokenService } from "../types/service-interface/ITokenService";
import { IEmailService } from "../types/service-interface/IEmailService";
import { ICacheService } from "../types/service-interface/ICacheService";
import { config } from "../config";
import { AuthEvent, authEvents } from "../events/auth.events";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepository,
    @inject("IBcryptUtils") private _passwordBcrypt: IBcryptUtils,
    @inject("IGoogleService") private _googleService: IGoogleService,
    @inject("ITokenService") private _tokenService: ITokenService,
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("ICacheService") private _cache: ICacheService
  ) {}

  async register(user: userDto): Promise<IUser> {
    const { firstName, lastName, email, phone, password } = user;
    const emailExists = await this._userRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError("User already exists", HTTP_STATUS.CONFLICT);
    }

    const hashedPassword = await this._passwordBcrypt.hash(password);
    const newUser = await this._userRepository.create({
      userId: uuidv4(),
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    authEvents.emit(AuthEvent.UserRegistered, { userEmail: email });

    return newUser;
  }

  async login(user: userDto): Promise<responseDataDto<IUser>> {
    const { email, password } = user;
    const userData = await this._userRepository.findByEmail(email);

    if (!userData || !userData?.password) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const isPasswordMatch = await this._passwordBcrypt.compare(
      password,
      userData.password
    );

    if (!isPasswordMatch) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (!userData.isEmailVerified) {
      throw new AppError(
        "Please verify your email to login",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const accessToken = this._tokenService.generateAccessToken({
      userid: userData.userId as string,
      email: userData.email,
      role: "user",
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      userid: userData.userId as string,
      email: userData.email,
      role: "user",
    });

    return { accessToken, refreshToken, user: userData };
  }

  async sendForgotPassword(email: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      return;
    }
    const token = uuidv4();
    this._cache.set(`forgotToken:${token}`, user.userId, 3600);

    const link = `${config.cors.ALLOWED_ORIGIN}/reset-password?token=${token}`;

    await this._emailService.sendForgotEmail(
      user.email,
      "Reset Your Password",
      link,
      user.firstName
    );
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const userId = await this._cache.get(`forgotToken:${token}`);
    if (!userId) {
      throw new AppError(
        "Invalid or expired password reset link",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const hashedPassword = await this._passwordBcrypt.hash(password);
    const updated = await this._userRepository.update(
      { userId },
      { password: hashedPassword }
    );

    if (!updated) {
      throw new AppError(
        "Failed to update password. Please try again.",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
    await this._cache.del(`forgotToken:${token}`);
  }

  async googleAuthentication(token: string): Promise<IUser> {
    const payload = await this._googleService.getUserInfoFromAccessToken(token);

    const { googleId, email, firstName = "", lastName = "" } = payload;

    let user = await this._userRepository.findByEmail(email);

    if (!user) {
      user = await this._userRepository.create({
        userId: uuidv4(),
        firstName,
        lastName,
        email,
        googleId,
        isEmailVerified: true,
      });
    } else if (!user.googleId) {
      await this._userRepository.update({ userId: user.userId }, { googleId });
    }

    if (!user?.isActive) {
      throw new AppError(ERROR_MESSAGES.USER_BLOCKED, HTTP_STATUS.UNAUTHORIZED);
    }

    return user;
  }

  async adminLogin(
    user: Omit<userDto, "firstName">
  ): Promise<responseDataDto<IUser>> {
    const { email, password } = user;
    const userData = await this._userRepository.findByEmail(email);

    if (!userData || !userData?.password) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const isPasswordMatch = await this._passwordBcrypt.compare(
      password,
      userData.password
    );

    if (!isPasswordMatch) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (!userData.isAdmin) {
      throw new AppError("you are not an admin", HTTP_STATUS.FORBIDDEN);
    }

    const accessToken = this._tokenService.generateAccessToken({
      userid: userData.userId,
      email: userData.email,
      role: "admin",
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      userid: userData.userId,
      email: userData.email,
      role: "admin",
    });

    const response = {
      accessToken,
      refreshToken,
      user: userData,
    };

    return response;
  }
}
