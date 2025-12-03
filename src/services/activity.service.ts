import { v4 as uuidv4 } from "uuid";
import { inject, injectable } from "tsyringe";
import { IActivityService } from "../types/service-interface/IActivityService";
import { IActivityRepository } from "../types/repository-interfaces/IActivityRepository";
import {
  ActivityResponseDto,
  CreateActivityDto,
} from "../types/dtos/activity/activity.dto";
import { IUser } from "../types/entities/IUser";

@injectable()
export class ActivityService implements IActivityService {
  constructor(
    @inject("IActivityRepository") private _activityRepo: IActivityRepository
  ) {}

  async createActivity(data: CreateActivityDto): Promise<void> {
    const newActivity = {
      activityId: uuidv4(),
      workspaceId: data.workspaceId,
      projectId: data.projectId,
      taskId: data.taskId,
      entityId: data.entityId,
      entityType: data.entityType,
      description: data.description,
      action: data.action,
      oldValue: data.oldValue,
      newValue: data.newValue,
      member: data.member,
    };

    await this._activityRepo.create(newActivity); 
  }

  async getTaskAcivities(taskId: string): Promise<ActivityResponseDto[]> {
    const activities = await this._activityRepo.getActivitiesByMember({
      taskId,
    });

    const mappedActivities = activities.map((activity) => {
      const member = activity.member as IUser;

      return {
        activityId: activity.activityId,
        workspaceId: activity.workspaceId,
        projectId: activity.projectId,
        taskId: activity.taskId,
        entityId: activity.entityId,
        entityType: activity.entityType,
        action: activity.action,
        description: activity.description,
        oldValue: activity.oldValue,
        newValue: activity.newValue,
        member: {
          userId: member.userId,
          name: member.firstName,
          email: member.email,
          profile: member.profile,
        },
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt,
      };
    });

    return mappedActivities;
  }
}
