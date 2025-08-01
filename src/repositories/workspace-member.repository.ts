import { injectable } from "tsyringe";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import { BaseRepository } from "./base.repository";
import { IWorkspaceMember } from "../types/entities/IWorkspaceMember";
import { workspaceMemberModel } from "../models/workspaceMembers.model";
import { PaginatedResponseDto } from "../types/dtos/paginated.dto";
import {
  WorkspaceMemberDto,
  WorkspaceMemberRepoDto,
} from "../types/dtos/workspaces/workspace-member.dto";

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
    skip: number,
    limit: number
  ): Promise<WorkspaceMemberRepoDto> {
    const result = await this.model.aggregate([
      { $match: { workspaceId } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "userId",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          role: 1,
          "user.firstName": 1,
          "user.email": 1,
          "user.userId": 1,
        },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    const { data, totalCount } = result[0];
    const count = totalCount?.[0]?.count || 0;
    console.log(data);
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
}
