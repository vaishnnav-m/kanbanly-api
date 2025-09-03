import Stripe from "stripe";
import { config } from "../../config";

export const stripe = new Stripe(config.stripe.STRIPE_SERCRET!, {
  apiVersion: "2025-07-30.basil",
});
