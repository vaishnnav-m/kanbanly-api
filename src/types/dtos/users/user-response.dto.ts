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
