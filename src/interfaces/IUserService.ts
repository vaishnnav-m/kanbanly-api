import { userDto } from "./dtos/createUser.dtos";
import { IUser } from "./IUser";

export interface IUserService {
  register(user: userDto): Promise<IUser | void>;
}
