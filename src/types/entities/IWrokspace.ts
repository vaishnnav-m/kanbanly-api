import { Document, ObjectId } from "mongoose";

export interface IWorkspace extends Document {
  workspaceId: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  createdBy: string | ObjectId;
  members: [
    {
      user: string;
      role: "owner" | "projectManager" | "member";
    }
  ];
}
