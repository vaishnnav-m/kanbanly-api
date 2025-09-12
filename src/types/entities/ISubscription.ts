import { SubscriptionStatus } from "../enums/subscription-status.enum";

export interface ISubscription {
  subscriptionId: string;
  userId: string;
  planId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: SubscriptionStatus;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}
