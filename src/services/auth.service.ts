import { inject, injectable } from "tsyringe";
import { userDto } from "../types/dtos/createUser.dto";
import { IAuthService } from "../types/service-interface/IAuthService";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { IBcryptUtils } from "../types/common/IBcryptUtils";
import { IUser } from "../types/IUser";
import AppError from "../shared/utils/AppError";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { EventEmitter } from "events";
import { OAuth2Client } from "google-auth-library";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { config } from "../config";
import { IGoogleService } from "../types/service-interface/IGoogleService";

export const authEvents = new EventEmitter();

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepository,
    @inject("IBcryptUtils") private _passwordBcrypt: IBcryptUtils,
    @inject("IGoogleService") private _googleService: IGoogleService
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

  async login(user: userDto): Promise<IUser> {
    const { email, password } = user;
    const emailExists = await this._userRepository.findByEmail(email);

    if (!emailExists) {
      throw new AppError("Invalid Email or Password", HTTP_STATUS.BAD_REQUEST);
    }

    const isPasswordMatch = await this._passwordBcrypt.compare(
      password,
      emailExists.password
    );

    if (!isPasswordMatch) {
      throw new AppError("Invalid Email or Password", HTTP_STATUS.BAD_REQUEST);
    }

    if (!emailExists.isEmailVerified) {
      throw new AppError(
        "Please verify your email to login",
        HTTP_STATUS.FORBIDDEN
      );
    }

    return emailExists;
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
}
