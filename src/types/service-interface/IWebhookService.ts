import Stripe from "stripe";

export interface IWebhookService {
  handleStripeWebhookEvent(event: Stripe.Event): Promise<void>;
}
