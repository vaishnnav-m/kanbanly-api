import { ObjectId } from "mongoose";

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  logo?: string;
  createdBy?: string | ObjectId;
}
