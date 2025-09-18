import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { IWebhookService } from "../types/service-interface/IWebhookService";
import { ISubscriptionRepository } from "../types/repository-interfaces/ISubscriptionRepository";
import logger from "../logger/winston.logger";
import { HTTP_STATUS } from "../shared/constants/http.status";
import AppError from "../shared/utils/AppError";
import Stripe from "stripe";
import { stripe } from "../shared/utils/stripeClient";
import { SubscriptionStatus } from "../types/enums/subscription-status.enum";
import { ISubscription } from "../types/entities/ISubscription";

@injectable()
export class WebhookService implements IWebhookService {
  constructor(
    @inject("ISubscriptionRepository")
    private _subscriptionRepo: ISubscriptionRepository
  ) {}

  private _getCurrentPeriodEnd(currentPeriodStart: Date, interval: string) {
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

  async handleStripeWebhookEvent(event: any): Promise<void> {
    logger.log("event:", event);
    switch (event.type) {
      case "checkout.session.completed":
        await this._handleCheckoutCompleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await this._handleInvoiceSucceded(event.data.object);
        break;
      case "invoice.payment_failed":
        await this._handlePaymentFailed(event.data.object);
        break;
      case "customer.subscription.updated":
        await this._handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await this._handleSubscriptionDeleted(event.data.object);
        break;
      default:
        logger.warn("Unhandled event", event.type);
    }
  }

  private async _handleCheckoutCompleted(session: any): Promise<void> {
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
    let currentPeriodEnd = this._getCurrentPeriodEnd(
      currentPeriodStart,
      interval
    );

    const subscriptionData = {
      planId,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: stripeSubscription.items.data[0].price.id,
      status: SubscriptionStatus.pending,
      currentPeriodStart: new Date(
        stripeSubscription.billing_cycle_anchor * 1000
      ),
      currentPeriodEnd,
    };

    const existingSubscription = await this._subscriptionRepo.findOne({
      userId,
    });

    if (existingSubscription) {
      await this._subscriptionRepo.update({ userId }, subscriptionData);
    } else {
      await this._subscriptionRepo.create({
        subscriptionId: uuidv4(),
        userId,
        ...subscriptionData,
      });
    }
  }

  private async _handleInvoiceSucceded(invoice: Stripe.Invoice): Promise<void> {
    const subscriptionId = invoice.parent?.subscription_details?.subscription;

    const subscription = await this._subscriptionRepo.findOne({
      stripeSubscriptionId: subscriptionId,
    });

    if (subscriptionId) {
      await this._subscriptionRepo.update(
        {
          stripeSubscriptionId: subscriptionId,
        },
        { status: SubscriptionStatus.active }
      );
    }
  }

  private async _handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
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

  private async _handleSubscriptionUpdated(
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
    const currentPeriodEnd = this._getCurrentPeriodEnd(
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

  private async _handleSubscriptionDeleted(subscription: any): Promise<void> {
    await this._subscriptionRepo.update(
      { stripeSubscriptionId: subscription.id },
      { status: SubscriptionStatus.canceled }
    );
  }
}
