import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IPlanController } from "../types/controller-interfaces/IPlanController";
import { IPlanService } from "../types/service-interface/IPlanService";
import { CreatePlanDto, EditPlanDto } from "../types/dtos/plan/plan.dto";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { SUCCESS_MESSAGES } from "../shared/constants/messages";
import AppError from "../shared/utils/AppError";

@injectable()
export class PlanController implements IPlanController {
  constructor(@inject("IPlanService") private _planService: IPlanService) {}

  async createPlan(req: Request, res: Response): Promise<void> {
    const planData = req.body as CreatePlanDto;

    await this._planService.createPlan(planData);

    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_CREATED });
  }

  async getAllPlans(req: Request, res: Response): Promise<void> {
    const plans = await this._planService.getAllPlans();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: plans,
    });
  }

  async getPlanById(req: Request, res: Response): Promise<void> {
    const planId = req.params.planId as string;

    const plan = await this._planService.getPlanById(planId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: plan,
    });
  }

  async editPlan(req: Request, res: Response): Promise<void> {
    const planId = req.params.planId as string;
    if (!planId) {
      throw new AppError("PlanId is needed", HTTP_STATUS.BAD_REQUEST);
    }
    const planData = req.body as Omit<EditPlanDto, "planId">;

    await this._planService.editPlan({ planId, ...planData });

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_EDITED });
  }

  async deletePlan(req: Request, res: Response): Promise<void> {
    const planId = req.params.planId as string;
    if (!planId) {
      throw new AppError("PlanId is needed", HTTP_STATUS.BAD_REQUEST);
    }

    await this._planService.deletePlan(planId);

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.DATA_DELETED });
  }
}
