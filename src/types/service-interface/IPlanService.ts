import {
  CreatePlanDto,
  PlanListDto,
  PlanResponseDto,
} from "../dtos/plan/plan.dto";

export interface IPlanService {
  createPlan(plan: CreatePlanDto): Promise<void>;
  getAllPlans(): Promise<PlanListDto[]>;
  getPlanById(planId: string): Promise<PlanResponseDto | null>;
}
