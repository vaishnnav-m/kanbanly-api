import { inject, injectable } from "tsyringe";
import { ISubscriptionController } from "../types/controller-interfaces/ISubscriptionController";
import { ISubscriptionService } from "../types/service-interface/ISubscriptionService";
import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import AppError from "../shared/utils/AppError";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject("ISubscriptionService")
    private _subscriptionService: ISubscriptionService
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

    res
      .status(HTTP_STATUS.OK)
      .json({
        success: true,
        message: SUCCESS_MESSAGES.DATA_CREATED,
        data: result,
      });
  }

  async handleStripeWebhook(req: Request, res: Response): Promise<void> {}
}
