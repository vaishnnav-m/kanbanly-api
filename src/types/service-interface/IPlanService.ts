import {
  CreatePlanDto,
  EditPlanDto,
  PlanListDto,
  PlanResponseDto,
} from "../dtos/plan/plan.dto";

export interface IPlanService {
  createPlan(plan: CreatePlanDto): Promise<void>;
  getAllPlans(): Promise<PlanListDto[]>;
  getPlanById(planId: string): Promise<PlanResponseDto | null>;
  editPlan(newPlan: EditPlanDto): Promise<void>;
  deletePlan(planId: string): Promise<void>;
}
