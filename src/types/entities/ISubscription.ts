import { SubscriptionStatus } from "../enums/subscription-status.enum";

export interface ISubscription {
  subscriptionId: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  createdAt: Date;
  updatedAt: Date;
}
