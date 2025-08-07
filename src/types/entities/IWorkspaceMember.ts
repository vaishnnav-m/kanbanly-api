import { ObjectId } from "mongoose";
import { workspaceRoles } from "../dtos/workspaces/workspace-member.dto";

export interface IWorkspaceMember {
  workspaceId: string | ObjectId;
  userId: string | ObjectId;
  email: string;
  name: string;
  role: workspaceRoles;
  createdAt: Date;
  isActive: boolean;
}
