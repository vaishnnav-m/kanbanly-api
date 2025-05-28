import { userDto } from "../dtos/createUser.dto";
import { IUser } from "../IUser";

export interface IUserService {
  register(user: userDto): Promise<IUser | void>;
}
