import { inject, injectable } from "tsyringe";
import { ISubscriptionController } from "../types/controller-interfaces/ISubscriptionController";
import { ISubscriptionService } from "../types/service-interface/ISubscriptionService";
import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import AppError from "../shared/utils/AppError";
import { stripe } from "../shared/utils/stripeClient";
import { config } from "../config";
import { IWebhookService } from "../types/service-interface/IWebhookService";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject("ISubscriptionService")
    private _subscriptionService: ISubscriptionService,
    @inject("IWebhookService") private _webhookService: IWebhookService
  ) {}

  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    const { planId, billingCycle = "monthly" } = req.body;
    const userId = req.user?.userid;
    const email = req.user?.email;

    if (!userId || !email) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const result = await this._subscriptionService.createCheckoutSession({
      userId,
      email,
      planId,
      billingCycle,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_CREATED,
      data: result,
    });
  }

  async handleStripeWebhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"] as string;
    let event: any;

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.WEBHOOK_SECRET
    );

    await this._webhookService.handleStripeWebhookEvent(event);
    res.status(HTTP_STATUS.OK).json({ received: true });
  }

  async verifyCheckoutSession(req: Request, res: Response): Promise<void> {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) {
      throw new AppError("Session ID is required", HTTP_STATUS.BAD_REQUEST);
    }

    const result = await this._subscriptionService.verifyCheckoutSession(
      sessionId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "successfully fetched session",
      data: result,
    });
  }

  async getUserSubscription(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userid;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.AUTH_INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const subscription = await this._subscriptionService.getUserSubscription(
      userId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: subscription,
    });
  }
}
