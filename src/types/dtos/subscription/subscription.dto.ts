import { SubscriptionStatus } from "../../enums/subscription-status.enum";

export interface CreateSubscriptionDto {
  userId: string;
  planId: string;
  
}

export interface CreateCheckoutSessionDto {
  userId: string;
  planId: string;
  billingCycle: "monthly" | "yearly";
  email: string;
}

export interface VerifyCheckoutSessionResponseDto {
  status: SubscriptionStatus;
}

export interface SubscriptionResponseDto {
  planName: string;
  currentPeriodEnd: Date | null;
  limits: {
    workspaces: number | string;
    members: number | string;
    projects: number | string;
    tasks: number | string;
  };
}
