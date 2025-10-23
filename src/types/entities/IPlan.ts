export interface IPlan {
  planId: string;
  name: string;
  normalizedName: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  workspaceLimit: number | string;
  projectLimit: number | string;
  taskLimit: number | string;
  memberLimit: number | string;
  features?: string[];
  stripeProductId?: string;
  stripeMonthlyPriceId?: string;
  stripeYearlyPriceId?: string;
  isDeleted: boolean;
}
