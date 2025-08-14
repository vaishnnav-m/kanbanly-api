export interface CreatePlanDto {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  workspaceLimit: number | string;
  projectLimit: number | string;
  taskLimit: number | string;
  memberLimit: number | string;
  features?: [string];
}

// export interface PlanListDto {

// }
