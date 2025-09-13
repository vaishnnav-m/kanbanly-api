import {
  CreateCheckoutSessionDto,
  VerifyCheckoutSessionResponseDto,
} from "../dtos/subscription/subscription.dto";

export interface ISubscriptionService {
  createCheckoutSession(
    data: CreateCheckoutSessionDto
  ): Promise<{ url: string | null; sessionId: string }>;
  handleWebhookEvent(event: any): Promise<void>;
  verifyCheckoutSession(
    sessionId: string
  ): Promise<VerifyCheckoutSessionResponseDto>;
}
