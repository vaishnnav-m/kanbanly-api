import { responseDataDto, userDto } from "../dtos/auth/createUser.dto";
import { IUser } from "../entities/IUser";

export interface IAuthService {
  register(user: userDto): Promise<IUser>;
  login(user: Omit<userDto, "firstName">): Promise<responseDataDto<IUser>>;
  sendForgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  googleAuthentication(token: string): Promise<IUser>;
  adminLogin(user: Omit<userDto, "firstName">): Promise<responseDataDto<IUser>>;
}
