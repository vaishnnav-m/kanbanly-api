import { SubscriptionStatus } from "../../enums/subscription-status.enum";

export interface CreateCheckoutSessionDto {
  userId: string;
  planId: string;
  billingCycle: "monthly" | "yearly";
  email: string;
}

export interface VerifyCheckoutSessionResponseDto {
  status: SubscriptionStatus;
}
