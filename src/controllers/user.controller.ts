import { Request, Response } from "express";
import { IUserController } from "../interfaces/IUserController";
import { inject, injectable } from "tsyringe";
import { IUserService } from "../interfaces/IUserService";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { ApiResponse } from "../interfaces/IApiResponse";
import { IUser } from "../interfaces/IUser";
import { SUCCESS_MESSAGES } from "../shared/constants/messages";

@injectable()
export class UserController implements IUserController {
  constructor(@inject("IUserService") private userService: IUserService) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      await this.userService.register(req.body);

      const response: ApiResponse<IUser> = {
        success: true,
        message: SUCCESS_MESSAGES.REGISTRATION_SUCCESSFUL,
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      console.log(error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error ? error : "Internal Server Error",
      });
    }
  }
}
