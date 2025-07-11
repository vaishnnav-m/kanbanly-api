import { injectable, inject } from "tsyringe";
import { IAdminController } from "../types/controller-interfaces/IAdminController";
import { Request, Response } from "express";
import { IAdminService } from "../types/service-interface/IAdminService";
import { HTTP_STATUS } from "../shared/constants/http.status";
import AppError from "../shared/utils/AppError";

@injectable()
export class AdminController implements IAdminController {
  constructor(@inject("IAdminService") private _adminService: IAdminService) {}

  async getAllUsers(req: Request, res: Response) {
    const users = await this._adminService.getAllUsers();
    res.status(HTTP_STATUS.OK).json({
      message: "Users fetched successfully",
      data: users,
    });
  }

  async updateUserStatus(req: Request, res: Response) {
    const userId = req.params.id;
    if (!userId) {
      throw new AppError("User id is not provided", HTTP_STATUS.BAD_REQUEST);
    }

    const newUser = await this._adminService.updateUserStatus(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "successfully updated the user",
      data: newUser,
    });
  }
}
