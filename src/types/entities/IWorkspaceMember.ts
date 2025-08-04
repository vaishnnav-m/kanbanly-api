import { ObjectId } from "mongoose";
import { workspaceRoles } from "../dtos/workspaces/workspace-member.dto";

export interface IWorkspaceMember {
  workspaceId: string | ObjectId;
  userId: string | ObjectId;
  role: workspaceRoles;
  createdAt: Date;
}
