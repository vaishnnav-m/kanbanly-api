export interface createCheckoutSessionDto {
  userId: string;
  planId: string;
  billingCycle: "monthly" | "yearly";
  email: string;
}
