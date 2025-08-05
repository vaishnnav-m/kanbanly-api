import {
  EditUserDto,
  EditUserPasswordDto,
  UserDataResponseDto,
} from "../dtos/users/user-response.dto";

export interface IUserService {
  getUserData(userId: string): Promise<UserDataResponseDto>;
  editUserData(data: EditUserDto): Promise<void>;
  editUserPassword(data: EditUserPasswordDto): Promise<void>;
}
