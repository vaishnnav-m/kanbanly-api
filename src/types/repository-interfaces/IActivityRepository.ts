import { FilterQuery } from "mongoose";
import { IActivity } from "../entities/IActivity";
import { IBaseRepository } from "./IBaseRepositroy";

export interface IActivityRepository extends IBaseRepository<IActivity> {
  getActivitiesByMember(query: FilterQuery<IActivity>): Promise<IActivity[]>;
  countToday(workspaceId: string): Promise<number>;
}
