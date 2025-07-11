export interface UserAdminTableDto {
  userId: string;
  firstName: string;
  lastName?: string;
  email: string;
  isActive: boolean;
}