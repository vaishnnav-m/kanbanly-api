import { controllerMethod } from "../common/ControllerMethod";

export interface ISubscriptionController {
  createCheckoutSession: controllerMethod;
  handleStripeWebhook: controllerMethod;
}
