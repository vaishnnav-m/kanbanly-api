import { responseDataDto, userDto } from "../dtos/createUser.dto";
import { IUser } from "../entities/IUser";

export interface IAuthService {
  register(user: userDto): Promise<IUser>;
  login(user: Omit<userDto, "firstName">): Promise<responseDataDto<IUser>>;
  googleAuthentication(token: string): Promise<IUser>;
  adminLogin(user: Omit<userDto, "firstName">): Promise<responseDataDto<IUser>>;
}
