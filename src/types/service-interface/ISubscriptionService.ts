import {
  CreateCheckoutSessionDto,
  SubscriptionResponseDto,
  VerifyCheckoutSessionResponseDto,
} from "../dtos/subscription/subscription.dto";
import { ISubscription } from "../entities/ISubscription";

export interface ISubscriptionService {
  createCheckoutSession(
    data: CreateCheckoutSessionDto
  ): Promise<{ url: string | null; sessionId: string }>;
  handleWebhookEvent(event: any): Promise<void>;
  verifyCheckoutSession(
    sessionId: string
  ): Promise<VerifyCheckoutSessionResponseDto>;
  getUserSubscription(userId: string): Promise<SubscriptionResponseDto | null>;
}
