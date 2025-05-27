import { inject, injectable } from "tsyringe";
import { userDto } from "../interfaces/dtos/createUser.dtos";
import { IUserService } from "../interfaces/IUserService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IPasswordUtils } from "../interfaces/IPasswordUtils";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IPasswordUtils") private passwordBcrypt: IPasswordUtils
  ) {}
  async register(user: userDto): Promise<void> {
    const { firstName, lastName, email, phone, password } = user as userDto;
    const emailExists = await this.userRepository.findByEmail(user.email);

    if (emailExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await this.passwordBcrypt.hash(password);
    const newUser = await this.userRepository.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });
  }
}
