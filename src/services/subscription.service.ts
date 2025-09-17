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
  SubscriptionResponseDto,
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

  // checkout session creation
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

    if (plan.monthlyPrice === 0 && plan.yearlyPrice === 0) {
      await this._subscriptionRepo.create({
        subscriptionId: uuidv4(),
        planId: plan.planId,
        userId: userId,
        status: SubscriptionStatus.active,
        currentPeriodEnd: null,
        currentPeriodStart: null,
      });

      return { sessionId: "", url: "" };
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

  // checkout session verification
  async verifyCheckoutSession(
    sessionId: string
  ): Promise<VerifyCheckoutSessionResponseDto> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      throw new AppError("invalid checkout session", HTTP_STATUS.BAD_REQUEST);
    }

    const subscriptionId = session.subscription;

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

  // get user specific subscription
  async getUserSubscription(
    userId: string
  ): Promise<SubscriptionResponseDto | null> {
    const subscription = await this._subscriptionRepo.findOne({
      userId,
      status: SubscriptionStatus.active,
    });

    if (!subscription) {
      const freePlan = await this._planRepo.findOne({ monthlyPrice: 0 });
      if (!freePlan) {
        throw new AppError("Plan not found", HTTP_STATUS.NOT_FOUND);
      }
      return {
        planName: freePlan.name,
        currentPeriodEnd: null,
        limits: {
          workspaces: freePlan.workspaceLimit,
          members: freePlan.memberLimit,
          projects: freePlan.projectLimit,
          tasks: freePlan.taskLimit,
        },
      };
    }

    const plan = await this._planRepo.findOne({ planId: subscription.planId });
    if (!plan) {
      throw new AppError("Plan not found", HTTP_STATUS.NOT_FOUND);
    }

    return {
      planName: plan.name,
      currentPeriodEnd: subscription.currentPeriodEnd!,
      limits: {
        workspaces: plan.workspaceLimit,
        members: plan.memberLimit,
        projects: plan.projectLimit,
        tasks: plan.taskLimit,
      },
    };
  }
}
