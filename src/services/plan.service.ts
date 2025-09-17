import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import {
  CreatePlanDto,
  PlanListDto,
  PlanResponseDto,
} from "../types/dtos/plan/plan.dto";
import { IPlanService } from "../types/service-interface/IPlanService";
import { normalizeString } from "../shared/utils/stringNormalizer";
import { IPlanRepository } from "../types/repository-interfaces/IPlanRepository";
import AppError from "../shared/utils/AppError";
import { ERROR_MESSAGES } from "../shared/constants/messages";
import { HTTP_STATUS } from "../shared/constants/http.status";
import { IPlan } from "../types/entities/IPlan";
import { config } from "../config";
import { stripe } from "../shared/utils/stripeClient";

@injectable()
export class PlanService implements IPlanService {
  private _normalizeName;
  constructor(@inject("IPlanRepository") private _planRepo: IPlanRepository) {
    this._normalizeName = normalizeString;
  }

  async createPlan(plan: CreatePlanDto): Promise<void> {
    const normalizedName = this._normalizeName(plan.name);
    const exsistingPlan = await this._planRepo.findOne({ normalizedName });
    if (exsistingPlan) {
      throw new AppError(
        ERROR_MESSAGES.RESOURCE_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    if (plan.monthlyPrice < 0 || plan.yearlyPrice < 0) {
      throw new AppError("Price cannot be negative", HTTP_STATUS.BAD_REQUEST);
    }

    const newPlan: IPlan = {
      planId: uuidv4(),
      name: plan.name,
      normalizedName: normalizedName,
      description: plan.description,
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      workspaceLimit: plan.workspaceLimit,
      memberLimit: plan.memberLimit,
      projectLimit: plan.projectLimit,
      taskLimit: plan.taskLimit,
      ...(plan.features && { features: plan.features }),
    };

    if (newPlan.monthlyPrice || newPlan.yearlyPrice) {
      const stripeProduct = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: { planId: newPlan.planId },
      });

      const toMinor = (amt: number) => Math.round(amt * 100);

      const stripeMonthlyPrice = await stripe.prices.create({
        unit_amount: toMinor(plan.monthlyPrice),
        currency: config.stripe.currency,
        recurring: { interval: "month" },
        product: stripeProduct.id,
      });

      const stripeYearlyPrice = await stripe.prices.create({
        unit_amount: toMinor(plan.yearlyPrice),
        currency: config.stripe.currency,
        recurring: { interval: "year" },
        product: stripeProduct.id,
      });

      newPlan.stripeProductId = stripeProduct.id;
      newPlan.stripeMonthlyPriceId = stripeMonthlyPrice.id;
      newPlan.stripeYearlyPriceId = stripeYearlyPrice.id;
    }

    await this._planRepo.create(newPlan);
  }

  async getAllPlans(): Promise<PlanListDto[]> {
    const plans = await this._planRepo.find({}, { sort: { monthlyPrice: 1 } });
    if (!plans) {
      throw new AppError("No plans found", HTTP_STATUS.NOT_FOUND);
    }

    const mappedPlans = plans.map((plan) => ({
      planId: plan.planId,
      name: plan.name,
      description: plan.description,
      memberLimit: plan.memberLimit,
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      projectLimit: plan.projectLimit,
      taskLimit: plan.taskLimit,
      workspaceLimit: plan.workspaceLimit,
      features: plan.features,
    }));

    return mappedPlans;
  }

  async getPlanById(planId: string): Promise<PlanResponseDto | null> {
    const plan = await this._planRepo.findOne({ planId });
    if (!plan) {
      return null;
    }

    return {
      name: plan.name,
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      memberLimit: plan.memberLimit,
      projectLimit: plan.projectLimit,
      taskLimit: plan.taskLimit,
      workspaceLimit: plan.workspaceLimit,
      stripeMonthlyPriceId: plan.stripeMonthlyPriceId,
      stripeYearlyPriceId: plan.stripeYearlyPriceId,
    };
  }
}
