import { inject, injectable } from "tsyringe";
import { responseDataDto, userDto } from "../types/dtos/createUser.dto";
import { IAuthService } from "../types/service-interface/IAuthService";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { IBcryptUtils } from "../types/common/IBcryptUtils";
import { IUser } from "../types/entities/IUser";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { EventEmitter } from "events";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { IGoogleService } from "../types/service-interface/IGoogleService";
import { ITokenService } from "../types/service-interface/ITokenService";

export const authEvents = new EventEmitter();

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepository,
    @inject("IBcryptUtils") private _passwordBcrypt: IBcryptUtils,
    @inject("IGoogleService") private _googleService: IGoogleService,
    @inject("ITokenService") private _tokenService: ITokenService
  ) {}

  async register(user: userDto): Promise<IUser> {
    const { firstName, lastName, email, phone, password } = user;
    const emailExists = await this._userRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError("User already exists", HTTP_STATUS.CONFLICT);
    }

    const hashedPassword = await this._passwordBcrypt.hash(password);
    const newUser = await this._userRepository.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    authEvents.emit("userRegistered", { userEmail: email });

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
      userid: userData._id as string,
      email: userData.email,
      role: userData.isAdmin ? "Admin" : "User",
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      userid: userData._id as string,
      email: userData.email,
      role: userData.isAdmin ? "Admin" : "User",
    });

    return { accessToken, refreshToken, user: userData };
  }

  async googleAuthentication(token: string): Promise<IUser> {
    const payload = await this._googleService.getUserInfoFromAccessToken(token);

    const { googleId, email, firstName = "", lastName = "" } = payload;

    let user = await this._userRepository.findByEmail(email);

    if (!user) {
      user = await this._userRepository.create({
        firstName,
        lastName,
        email,
        googleId,
        isEmailVerified: true,
      });
    } else if (!user.googleId) {
      await this._userRepository.update(user.id, { googleId });
    }

    if (!user?.isActive) {
      throw new AppError(ERROR_MESSAGES.USER_BLOCKED, HTTP_STATUS.FORBIDDEN);
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
      userid:userData._id as string,
      email: userData.email,
      role: userData.isAdmin ? "Admin" : "User",
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      userid:userData._id as string,
      email: userData.email,
      role: userData.isAdmin ? "Admin" : "User",
    });

    const response = {
      accessToken,
      refreshToken,
      user: userData,
    };

    return response;
  }
}
