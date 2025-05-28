import { inject, injectable } from "tsyringe";
import { userDto } from "../interfaces/dtos/createUser.dto";
import { IUserService } from "../interfaces/service-interface/IUserService";
import { IUserRepository } from "../interfaces/repository-interfaces/IUserRepository";
import { IPasswordUtils } from "../interfaces/common/IPasswordUtils";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepository,
    @inject("IPasswordUtils") private _passwordBcrypt: IPasswordUtils
  ) {}
  async register(user: userDto): Promise<void> {
    const { firstName, lastName, email, phone, password } = user as userDto;
    const emailExists = await this._userRepository.findByEmail(user.email);

    if (emailExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await this._passwordBcrypt.hash(password);
    const newUser = await this._userRepository.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });
  }
}
