import { inject, injectable } from "tsyringe";
import { ISubscriptionService } from "../types/service-interface/ISubscriptionService";
import { ISubscriptionRepository } from "../types/repository-interfaces/ISubscriptionRepository";
import { stripe } from "../shared/utils/stripeClient";
import { config } from "../config";
import { SubscriptionStatus } from "../types/enums/subscription-status.enum";
import { createCheckoutSessionDto } from "../types/dtos/subscription/subscription.dto";
import { IPlanRepository } from "../types/repository-interfaces/IPlanRepository";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import logger from "../logger/winston.logger";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject("ISubscriptionRepository")
    private _subscriptionRepo: ISubscriptionRepository,
    @inject("IPlanRepository") private _planRepo: IPlanRepository
  ) {}

  async createCheckoutSession({
    userId,
    planId,
    billingCycle,
    email,
  }: createCheckoutSessionDto): Promise<{
    url: string | null;
    sessionId: string;
  }> {
    // checking if plan  exitsts
    const plan = await this._planRepo.findOne({ planId });
    if (!plan) {
      throw new AppError(ERROR_MESSAGES.PLAN_NOT_EXISTS, HTTP_STATUS.NOT_FOUND);
    }

    // checking if there is active subscription
    const existingSubscription = await this._subscriptionRepo.findOne({
      userId: userId,
    });
    if (
      existingSubscription &&
      existingSubscription.status === SubscriptionStatus.active
    ) {
      throw new AppError(
        ERROR_MESSAGES.ACTIVE_SUBSCRIPTION,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    let stripeCustomerId = existingSubscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;
    }

    const priceId =
      billingCycle === "monthly"
        ? plan.stripeMonthlyPriceId
        : plan.stripeYearlyPriceId;

    if (!priceId) {
      throw new AppError(
        `${billingCycle} pricing is not avilable`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${config.stripe.STRIPE_FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.stripe.STRIPE_FRONTEND_URL}/cancel`,
      metadata: {
        userId,
        planId,
        billingCycle,
      },
      subscription_data: {
        metadata: {
          userId,
          planId,
          billingCycle,
        },
      },
    });

    return { url: session.url, sessionId: session.id };
  }
  
  async handleWebhookEvent(event: any): Promise<void> {
    switch (event) {
      case "checkout.session.completed":
        await this.handleCheckoutCompleted(event.data.object);
        break;
      case "invoice.payment_succeded":
        await this.handleInvoiceSucceded(event.data.object);
        break;
      default:
        logger.log("Unhandled event", event.type);
    }
  }

  private async handleCheckoutCompleted(session: any): Promise<void> {
    const { userId, planId, billingCycle } = session.metadata;
    const subscriptionId = session.subscription;

    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscriptionId
    );

    logger.debug(session);

    // await this._subscriptionRepo.create({
    //   subscriptionId: uuidv4(),
    //   userId,
    //   planId,
    //   stripeCustomerId: session.customer,
    //   stripeSubscriptionId: subscriptionId,
    //   stripePriceId: stripeSubscription.items.data[0].price.id,
    //   status: SubscriptionStatus.active,
    //   currentPeriodStart:new Date(stripeSubscription)
    // });
  }

  private async handleInvoiceSucceded(session: any): Promise<void> {
    const { userId, planId, billingCycle } = session.metadata;
    const subscriptionId = session.subscription;

    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscriptionId
    );

    logger.debug(session);
  }
}
