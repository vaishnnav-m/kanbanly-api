import { inject, injectable } from "tsyringe";
import { IUserService } from "../types/service-interface/IUserService";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import {
  EditUserDto,
  EditUserPasswordDto,
  UserDataResponseDto,
} from "../types/dtos/users/user-response.dto";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IUser } from "../types/entities/IUser";
import { IBcryptUtils } from "../types/common/IBcryptUtils";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private _userRepo: IUserRepository,
    @inject("IBcryptUtils") private _passwordBcrypt: IBcryptUtils
  ) {}

  async getUserData(userId: string): Promise<UserDataResponseDto> {
    const user = await this._userRepo.findOne({ userId });
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    if (!user.isActive) {
      throw new AppError(ERROR_MESSAGES.USER_BLOCKED, HTTP_STATUS.BAD_REQUEST);
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      isGoogleLogin: user.password ? false : true,
    };
  }

  async editUserData(data: EditUserDto): Promise<void> {
    const user = await this._userRepo.findOne({ userId: data.userId });
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const newUser: Partial<IUser> = {
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
    };

    await this._userRepo.update({ userId: data.userId }, newUser);
  }

  async editUserPassword(data: EditUserPasswordDto): Promise<void> {
    const user = await this._userRepo.findOne({ userId: data.userId });
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (!user.password) {
      throw new AppError("User is signed with google", HTTP_STATUS.BAD_REQUEST);
    }

    const isPasswordMatch = await this._passwordBcrypt.compare(
      data.oldPassword,
      user.password
    );
    if (!isPasswordMatch) {
      throw new AppError("Invalid Password", HTTP_STATUS.BAD_REQUEST);
    }
    console.log(isPasswordMatch);
    const hashedPassword = await this._passwordBcrypt.hash(data.newPassword);

    await this._userRepo.update(
      { userId: data.userId },
      { password: hashedPassword }
    );
  }
}
