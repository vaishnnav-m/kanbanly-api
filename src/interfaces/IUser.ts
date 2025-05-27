import { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: String;
  password: string;
  profile?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

