export interface AuthUserResponseDto {
  userId: string;
  firstName: string;
  lastName?: string;
  email: string;
  profile?: string;
}

export interface userDto {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
}

export interface responseDataDto<T> {
  accessToken: string;
  refreshToken: string;
  user: T;
}
