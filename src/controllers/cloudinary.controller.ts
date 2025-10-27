import { Request, Response } from "express";
import { ICloudinaryController } from "../types/controller-interfaces/ICloudinaryController";
import { inject, injectable } from "tsyringe";
import { ICloudinaryService } from "../types/service-interface/ICloudinaryService";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { SUCCESS_MESSAGES } from "../shared/constants/messages";

@injectable()
export class CloudinaryController implements ICloudinaryController {
  constructor(
    @inject("ICloudinaryService") private _cloudinaryService: ICloudinaryService
  ) {}
  async getUploadSignature(req: Request, res: Response) {
    const signature = this._cloudinaryService.getUploadSignature();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: signature,
    });
  }
}
