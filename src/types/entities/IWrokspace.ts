import { ObjectId } from "mongoose";

export interface IWorkspace {
  workspaceId: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  createdBy: string | ObjectId;
  members: [ObjectId];
  createdAt: Date;
}
