export interface IWebhookService {
  handleStripeWebhookEvent(event: any): Promise<void>;
}
