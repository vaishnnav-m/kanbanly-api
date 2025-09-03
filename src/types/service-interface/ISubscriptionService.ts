import { createCheckoutSessionDto } from "../dtos/subscription/subscription.dto";

export interface ISubscriptionService {
  createCheckoutSession(
    data: createCheckoutSessionDto
  ): Promise<{ url: string | null; sessionId: string }>;
  handleWebhookEvent(event: any): Promise<void>;
}
