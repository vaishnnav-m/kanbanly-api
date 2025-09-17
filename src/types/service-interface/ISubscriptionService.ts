import {
  CreateCheckoutSessionDto,
  SubscriptionResponseDto,
  VerifyCheckoutSessionResponseDto,
} from "../dtos/subscription/subscription.dto";

export interface ISubscriptionService {
  createCheckoutSession(
    data: CreateCheckoutSessionDto
  ): Promise<{ url: string | null; sessionId: string }>;
  verifyCheckoutSession(
    sessionId: string
  ): Promise<VerifyCheckoutSessionResponseDto>;
  getUserSubscription(userId: string): Promise<SubscriptionResponseDto | null>;
}
