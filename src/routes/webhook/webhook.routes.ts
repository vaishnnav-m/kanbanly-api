import express from "express";
import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../base.routes";
import { ISubscriptionController } from "../../types/controller-interfaces/ISubscriptionController";

@injectable()
export class WebhookRoutes extends BaseRoute {
  constructor(
    @inject("ISubscriptionController")
    private _subscriptionController: ISubscriptionController
  ) {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this._router.post(
      "/stripe-webhook",
      express.raw({ type: "application/json" }),
      this._subscriptionController.handleStripeWebhook.bind(
        this._subscriptionController
      )
    );
  }
}
