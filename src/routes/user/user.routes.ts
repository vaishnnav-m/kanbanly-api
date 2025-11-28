import { inject, injectable } from "tsyringe";
import { BaseRoute } from "../base.routes";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { IUserController } from "../../types/controller-interfaces/IUserController";
import { IPreferenceController } from "../../types/controller-interfaces/IPreferenceController";
import { INotificationController } from "../../types/controller-interfaces/INotificationController";

@injectable()
export class UserRoutes extends BaseRoute {
  constructor(
    @inject("IUserController") private _userController: IUserController,
    @inject("IPreferenceController")
    private _preferenceController: IPreferenceController,
    @inject("INotificationController")
    private _notificationController: INotificationController
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this._router.get(
      "/me",
      authenticateToken,
      this._userController.getUserData.bind(this._userController)
    );
    this._router.put(
      "/me",
      authenticateToken,
      this._userController.updateUserData.bind(this._userController)
    );
    this._router.patch(
      "/me/password",
      authenticateToken,
      this._userController.updateUserPassword.bind(this._userController)
    );
    this._router.get(
      "/me/preferences",
      authenticateToken,
      this._preferenceController.getUserPreferences.bind(
        this._preferenceController
      )
    );
    this._router.put(
      "/me/preferences",
      authenticateToken,
      this._preferenceController.updateUserPreferences.bind(
        this._preferenceController
      )
    );
    this._router.get(
      "/me/notifications",
      authenticateToken,
      this._notificationController.getNotifications.bind(
        this._notificationController
      )
    );
    this._router.patch(
      "/me/notifications",
      authenticateToken,
      this._notificationController.markAsRead.bind(this._notificationController)
    );
  }
}
