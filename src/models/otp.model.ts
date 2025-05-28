import { model, Schema } from "mongoose";
import { IOtp } from "../interfaces/IOtp";

const otpSchema = new Schema<IOtp>(
  {
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const otpModel = model<IOtp>("otp", otpSchema);
