import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IPlanController } from "../types/controller-interfaces/IPlanController";
import { IPlanService } from "../types/service-interface/IPlanService";
import { CreatePlanDto } from "../types/dtos/plan/plan.dto";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { SUCCESS_MESSAGES } from "../shared/constants/messages";
import { success } from "zod";

@injectable()
export class PlanController implements IPlanController {
  constructor(@inject("IPlanService") private _planService: IPlanService) {}

  async createPlan(req: Request, res: Response): Promise<void> {
    const body = req.body as CreatePlanDto;
    const newPlan: CreatePlanDto = {
      name: body.name,
      description: body.description,
      monthlyPrice: body.monthlyPrice,
      yearlyPrice: body.yearlyPrice,
      workspaceLimit: body.workspaceLimit,
      memberLimit: body.memberLimit,
      projectLimit: body.projectLimit,
      taskLimit: body.taskLimit,
      features: body.features,
    };

    await this._planService.createPlan(newPlan);

    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_CREATED });
  }

  async getAllPlans(req: Request, res: Response): Promise<void> {
    const plans = await this._planService.getAllPlans();

    res
      .status(HTTP_STATUS.OK)
      .json({
        success: true,
        message: SUCCESS_MESSAGES.DATA_FETCHED,
        data: plans,
      });
  }
}
