export interface UserResponseDto {
  userId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  profile?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditUserDto {
  userId: string;
  firstName?: string;
  lastName?: string;
}

export interface EditUserPasswordDto {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export type UserDataResponseDto = Pick<
  UserResponseDto,
  "firstName" | "lastName" | "email" | "createdAt"
> & { isGoogleLogin: boolean };
