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
  }
}
