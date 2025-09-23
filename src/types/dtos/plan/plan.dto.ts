export interface CreatePlanDto {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  workspaceLimit: number | string;
  projectLimit: number | string;
  taskLimit: number | string;
  memberLimit: number | string;
  features?: string[];
}

export type PlanListDto = CreatePlanDto & {
  planId: string;
};

export type EditPlanDto = Partial<PlanListDto>;

export interface PlanResponseDto {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  workspaceLimit: number | string;
  projectLimit: number | string;
  taskLimit: number | string;
  memberLimit: number | string;
  stripeMonthlyPriceId?: string;
  stripeYearlyPriceId?: string;
}
