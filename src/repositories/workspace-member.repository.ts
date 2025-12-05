import { injectable } from "tsyringe";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import { BaseRepository } from "./base.repository";
import { IWorkspaceMember } from "../types/entities/IWorkspaceMember";
import { workspaceMemberModel } from "../models/workspaceMembers.model";
import { WorkspaceMemberRepoDto } from "../types/dtos/workspaces/workspace-member.dto";

@injectable()
export class WorkspaceMemberRepository
  extends BaseRepository<IWorkspaceMember>
  implements IWorkspaceMemberRepository
{
  constructor() {
    super(workspaceMemberModel);
  }

  async getMembers(
    workspaceId: string,
    skip: number = 0,
    limit: number = 10,
    search = ""
  ): Promise<WorkspaceMemberRepoDto> {
    const result = await this.model.aggregate([
      { $match: { workspaceId, email: { $regex: search, $options: "i" } } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    const { data, totalCount } = result[0];
    const count = totalCount?.[0]?.count || 0;
    return { data, count };
  }

  async getCount(workspaceId: string): Promise<number> {
    return await this.model.countDocuments({ workspaceId });
  }

  async getMember(
    workspaceId: string,
    userId: string
  ): Promise<IWorkspaceMember | null> {
    return await this.model.findOne({ workspaceId, userId }).populate("userId");
  }

  async countJoinedThisWeek(workspaceId: string): Promise<number> {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - day + (day === 0 ? -6 : 1));
    monday.setHours(0, 0, 0, 0);

    return this.model.countDocuments({
      workspaceId,
      createdAt: { $gte: monday },
    });
  }
}
