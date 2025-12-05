import { AnalyticsDTO } from "../dtos/analytics/analytics.dto";

export interface IAnalyticsService {
  getSummary(): Promise<AnalyticsDTO>;
}
