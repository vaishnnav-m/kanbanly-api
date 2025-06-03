import { model, Schema } from "mongoose";
import { IOtp } from "../types/IOtp";

const otpSchema = new Schema<IOtp>(
  {
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const otpModel = model<IOtp>("otp", otpSchema);
