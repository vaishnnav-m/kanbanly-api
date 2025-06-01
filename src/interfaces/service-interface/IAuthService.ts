import { userDto } from "../dtos/createUser.dto";
import { IUser } from "../IUser";

export interface IAuthService {
  register(user: userDto): Promise<IUser>;
  login(user: userDto): Promise<IUser>;
}
