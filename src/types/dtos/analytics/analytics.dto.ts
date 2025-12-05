export interface AnalyticsSummaryDTO {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  totalActiveSubscriptions: number;
}

export interface SalesAnalyticsDTO {
  date: string;
  count: number;
}

export interface UserAnalyticsDTO {
  date: string;
  count: number;
}

export interface PlanBreakdownItemDTO {
  planName: string;
  count: number;
}

export interface AnalyticsDTO {
  summary: AnalyticsSummaryDTO;
  salesAnalytics: SalesAnalyticsDTO[];
  userAnalytics: UserAnalyticsDTO[];
  planBreakdown: PlanBreakdownItemDTO[];
}
