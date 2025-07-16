export interface UserAdminTableDto {
  users: {
    userId: string;
    firstName: string;
    lastName?: string;
    email: string;
    isActive: boolean;
  }[];
  totalPages: number;
}
