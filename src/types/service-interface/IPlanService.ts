import { CreatePlanDto } from "../dtos/plan/plan.dto";

export interface IPlanService {
  createPlan(plan: CreatePlanDto): Promise<void>;
  // getAllPlans():Promise<>
}
