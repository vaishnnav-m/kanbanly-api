import { inject, injectable } from "tsyringe";
import { userDto } from "../interfaces/dtos/createUser.dto";
import { IAuthService } from "../interfaces/service-interface/IAuthService";
import { IUserRepository } from "../interfaces/repository-interfaces/IUserRepository";
import { IPasswordUtils } from "../interfaces/common/IPasswordUtils";
import { IUser } from "../interfaces/IUser";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepository,
    @inject("IPasswordUtils") private _passwordBcrypt: IPasswordUtils
  ) {}
  async register(user: userDto): Promise<IUser> {
    const { firstName, lastName, email, phone, password } = user;
    const emailExists = await this._userRepository.findByEmail(email);

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

    return newUser;
  }

  async login(user: userDto): Promise<IUser> {
    const { email, password } = user;
    const emailExists = await this._userRepository.findByEmail(email);
    console.log(">>>>>", email);

    if (!emailExists) {
      throw new Error("Invalid Email or Password");
    }


    const isPasswordMatch = await this._passwordBcrypt.compare(
      password,
      emailExists.password
    );

    if (!isPasswordMatch) {
      throw new Error("Invalid Email or Password");
    }

    return emailExists;
  }
}
