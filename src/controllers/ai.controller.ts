import { inject, injectable } from "tsyringe";
import { IAiController } from "../types/controller-interfaces/IAiController";
import { IAiService } from "../types/service-interface/IAiService";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../shared/constants/http.status";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";

@injectable()
export class AiController implements IAiController {
  constructor(@inject("IAiService") private _aiService: IAiService) {}

  async chat(req: Request, res: Response) {
    const { question, projectId } = req.body;
    const { workspaceId } = req.params;
    const userId = req.user?.userid;

    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const answer = await this._aiService.processUserQuery(
      userId,
      workspaceId,
      question,
      {
        currentProjectId: projectId,
      }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Response generated successfully",
      data: answer,
    });
  }
}
