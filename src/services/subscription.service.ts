import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import { ISubscriptionService } from "../types/service-interface/ISubscriptionService";
import { ISubscriptionRepository } from "../types/repository-interfaces/ISubscriptionRepository";
import { stripe } from "../shared/utils/stripeClient";
import { config } from "../config";
import { SubscriptionStatus } from "../types/enums/subscription-status.enum";
import {
  CreateCheckoutSessionDto,
  VerifyCheckoutSessionResponseDto,
} from "../types/dtos/subscription/subscription.dto";
import { IPlanRepository } from "../types/repository-interfaces/IPlanRepository";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import logger from "../logger/winston.logger";
import { ISubscription } from "../types/entities/ISubscription";

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
  }: CreateCheckoutSessionDto): Promise<{
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
      success_url: `${config.stripe.STRIPE_FRONTEND_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.stripe.STRIPE_FRONTEND_URL}/billing/cancel`,
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

  private getCurrentPeriodEnd(currentPeriodStart: Date, interval: string) {
    if (!interval) {
      throw new AppError(
        "Subscription interval missing",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
    let currentPeriodEnd;
    if (interval === "month") {
      currentPeriodEnd = new Date(currentPeriodStart);
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    } else if (interval === "year") {
      currentPeriodEnd = new Date(currentPeriodStart);
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    }

    return currentPeriodEnd;
  }

  async handleWebhookEvent(event: any): Promise<void> {
    logger.log("event:", event);
    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutCompleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await this.handleInvoiceSucceded(event.data.object);
        break;
      case "invoice.payment_failed":
        await this.handlePaymentFailed(event.data.object);
        break;
      case "customer.subscription.updated":
        await this.handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      default:
        logger.warn("Unhandled event", event.type);
    }
  }

  private async handleCheckoutCompleted(session: any): Promise<void> {
    const { userId, planId, billingCycle } = session.metadata;
    const subscriptionId = session.subscription;

    const stripeSubscription = (await stripe.subscriptions.retrieve(
      subscriptionId
    )) as Stripe.Subscription;

    // calculating the start and end of the plan
    const currentPeriodStart = new Date(
      stripeSubscription.billing_cycle_anchor * 1000
    );

    const interval = stripeSubscription.items.data[0].price.recurring?.interval;
    if (!interval) {
      throw new AppError(
        "Subscription interval missing",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
    let currentPeriodEnd = this.getCurrentPeriodEnd(
      currentPeriodStart,
      interval
    );

    // saving to the database
    await this._subscriptionRepo.create({
      subscriptionId: uuidv4(),
      userId,
      planId,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: stripeSubscription.items.data[0].price.id,
      status: SubscriptionStatus.pending,
      currentPeriodStart: new Date(
        stripeSubscription.billing_cycle_anchor * 1000
      ),
      currentPeriodEnd,
    });
  }

  private async handleInvoiceSucceded(invoice: Stripe.Invoice): Promise<void> {
    const subscriptionId = invoice.parent?.subscription_details?.subscription;

    const subscription = await this._subscriptionRepo.findOne({stripeSubscriptionId:subscriptionId});
      

    if (subscriptionId) {
      await this._subscriptionRepo.update(
        {
          stripeSubscriptionId: subscriptionId,
        },
        { status: SubscriptionStatus.active }
      );
    }
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const subscriptionId = invoice.parent?.subscription_details?.subscription;

    if (subscriptionId) {
      await this._subscriptionRepo.update(
        {
          stripeSubscriptionId: subscriptionId,
        },
        { status: SubscriptionStatus.past_due }
      );
    }
  }

  private async handleSubscriptionUpdated(
    subscription: Stripe.Subscription
  ): Promise<void> {
    const currentPeriodStart = new Date(
      subscription.billing_cycle_anchor * 1000
    );
    const interval = subscription.items.data[0].price.recurring?.interval;
    if (!interval) {
      throw new AppError(
        "Subscription interval missing",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
    const currentPeriodEnd = this.getCurrentPeriodEnd(
      currentPeriodStart,
      interval
    );

    const updates: Partial<ISubscription> = {
      currentPeriodStart,
      currentPeriodEnd,
    };

    switch (subscription.status) {
      case "active":
        updates.status = SubscriptionStatus.active;
        break;
      case "past_due":
        updates.status = SubscriptionStatus.past_due;
        break;
      case "canceled":
        updates.status = SubscriptionStatus.canceled;
        break;
    }

    await this._subscriptionRepo.update(
      {
        stripeSubscriptionId: subscription.id,
      },
      updates
    );
  }

  private async handleSubscriptionDeleted(subscription: any): Promise<void> {
    await this._subscriptionRepo.update(
      { stripeSubscriptionId: subscription.id },
      { status: SubscriptionStatus.canceled }
    );
  }

  async verifyCheckoutSession(
    sessionId: string
  ): Promise<VerifyCheckoutSessionResponseDto> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      throw new AppError("invalid checkout session", HTTP_STATUS.BAD_REQUEST);
    }

    const subscriptionId = session.subscription;
    console.log("subscription id in verify checkout", subscriptionId);
    if (!subscriptionId) {
      return { status: SubscriptionStatus.pending };
    }

    const subscription = await this._subscriptionRepo.findOne({
      stripeSubscriptionId: subscriptionId,
    });
    if (!subscription) {
      return { status: SubscriptionStatus.pending };
    }

    return { status: subscription.status };
  }
}
