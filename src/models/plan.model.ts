import { model, Schema } from "mongoose";
import { IPlan } from "../types/entities/IPlan";

const planSchema = new Schema<IPlan>(
  {
    planId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    normalizedName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    monthlyPrice: {
      type: Number,
      required: true,
    },
    yearlyPrice: {
      type: Number,
      required: true,
    },
    workspaceLimit: {
      type: Schema.Types.Mixed,
      requried: true,
    },
    memberLimit: {
      type: Schema.Types.Mixed,
      requried: true,
    },
    projectLimit: {
      type: Schema.Types.Mixed,
      requried: true,
    },
    taskLimit: {
      type: Schema.Types.Mixed,
      requried: true,
    },
    features: {
      type: [String],
    },
    stripeProductId: {
      type: String,
      required: true,
    },
    stripeMonthlyPriceId: {
      type: String,
      required: true,
    },
    stripeYearlyPriceId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const planModel = model("plan", planSchema);
