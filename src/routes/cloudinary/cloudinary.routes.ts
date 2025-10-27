import { inject, injectable } from "tsyringe";
import { ICloudinaryController } from "../../types/controller-interfaces/ICloudinaryController";
import { BaseRoute } from "../base.routes";

@injectable()
export class CloudinaryRoutes extends BaseRoute {
  constructor(
    @inject("ICloudinaryController")
    private _cloudinaryController: ICloudinaryController
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this._router.get(
      "/signature",
      this._cloudinaryController.getUploadSignature.bind(
        this._cloudinaryController
      )
    );
  }
}
