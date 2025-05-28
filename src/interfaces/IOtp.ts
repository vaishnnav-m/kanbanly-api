import { Document } from "mongoose";

export interface IOtp extends Document {
  otp: string;
  expiresAt: Date;
  email: string;
}