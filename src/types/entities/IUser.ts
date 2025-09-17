import { Document } from "mongoose";

export interface IUser extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}
