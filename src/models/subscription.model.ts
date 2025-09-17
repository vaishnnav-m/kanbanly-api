import { model, Schema } from "mongoose";
import { ISubscription } from "../types/entities/ISubscription";

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriptionId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    planId: {
      type: String,
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
    },
    stripeCustomerId: {
      type: String,
    },
    stripePriceId: {
      type: String,
    },
    currentPeriodStart: {
      type: Date,
    },
    currentPeriodEnd: {
      type: Date,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

export const subscriptionModel = model("subscription", subscriptionSchema);
