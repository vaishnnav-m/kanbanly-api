import { inject, injectable } from "tsyringe";
import { IAnalyticsService } from "../types/service-interface/IAnalyticsService";
import { IUserRepository } from "../types/repository-interfaces/IUserRepository";
import { IProjectRepository } from "../types/repository-interfaces/IProjectRepository";
import { ISubscriptionRepository } from "../types/repository-interfaces/ISubscriptionRepository";
import { AnalyticsDTO } from "../types/dtos/analytics/analytics.dto";

@injectable()
export class AnalyticsService implements IAnalyticsService {
  constructor(
    @inject("IUserRepository") private _userRepo: IUserRepository,
    @inject("IProjectRepository") private _projectRepo: IProjectRepository,
    @inject("ISubscriptionRepository")
    private _subscriptionRepo: ISubscriptionRepository
  ) {}

  async getSummary(): Promise<AnalyticsDTO> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 365);

    const [
      totalUsers,
      activeUsers,
      totalProjects,
      totalActiveSubscriptions,
      salesAnalytics,
      userAnalytics,
      planBreakdown,
    ] = await Promise.all([
      this._userRepo.countUsers(),
      this._userRepo.countUsers({ isActive: true }),
      this._projectRepo.countProjects(),
      this._subscriptionRepo.countSubscriptions({ status: "active" }),
      this._subscriptionRepo.groupSubscriptionsByCreatedDate(fromDate),
      this._userRepo.groupUsersByCreatedDate(fromDate),
      this._subscriptionRepo.groupActiveSubscriptionsByPlan(),
    ]);

    return {
      summary: {
        totalUsers,
        activeUsers,
        totalProjects,
        totalActiveSubscriptions,
      },
      salesAnalytics,
      userAnalytics,
      planBreakdown,
    };
  }
}
