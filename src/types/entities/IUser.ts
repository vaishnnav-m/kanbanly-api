import { IPlan } from "./IPlan";

export interface IUser {
  userId: string;
  firstName: string;
  lastName?: string;
  email: string;
  googleId: string;
  phone?: string;
  password: string;
  profile?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  isAdmin: boolean;
  plan: string | IPlan;
  planValidTill: Date;
  createdAt: Date;
  updatedAt: Date;
}
