import { injectable, inject } from "tsyringe";
import { IAdminController } from "../types/controller-interfaces/IAdminController";
import { Request, Response } from "express";
import { IAdminService } from "../types/service-interface/IAdminService";
import { HTTP_STATUS } from "../shared/constants/http.status";

@injectable()
export class AdminController implements IAdminController {
  constructor(@inject("IAdminService") private _adminService: IAdminService) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const users = await this._adminService.getAllUsers();
    res.status(HTTP_STATUS.OK).json({
      message: "Users fetched successfully",
      data: users,
    });
  }
}
