import { ObjectId } from "mongoose";

export interface IWorkspace {
  name: string;
  description: string;
  createdBy: string | ObjectId;
  members: [string];
}
