import express from "express";
import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../base.routes";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { ISubscriptionController } from "../../types/controller-interfaces/ISubscriptionController";

@injectable()
export class SubscriptionRoutes extends BaseRoute {
  constructor(
    @inject("ISubscriptionController")
    private _subscriptionController: ISubscriptionController
  ) {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/create-checkout",
      authenticateToken,
      this._subscriptionController.createCheckoutSession.bind(
        this._subscriptionController
      )
    );
    this._router.post(
      "/stripe-webhook",
      express.raw({ type: "application/json" }),
      this._subscriptionController.handleStripeWebhook.bind(
        this._subscriptionController
      )
    );
    this._router.get(
      "/verify-session",
      this._subscriptionController.verifyCheckoutSession.bind(
        this._subscriptionController
      )
    );
    this._router.get(
      "/me",
      authenticateToken,
      this._subscriptionController.getUserSubscription.bind(
        this._subscriptionController
      )
    );
  }
}
