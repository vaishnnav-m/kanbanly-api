import { AuthUserResponseDto, responseDataDto, userDto } from "../dtos/auth/auth.dto";

export interface IAuthService {
  register(user: userDto): Promise<AuthUserResponseDto>;
  login(user: Omit<userDto, "firstName">): Promise<responseDataDto<AuthUserResponseDto>>;
  sendForgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  googleAuthentication(token: string): Promise<AuthUserResponseDto>;
  adminLogin(user: Omit<userDto, "firstName">): Promise<responseDataDto<AuthUserResponseDto>>;
}
