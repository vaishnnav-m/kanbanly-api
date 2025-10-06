export interface IEpic {
  epicId: string;
  title: string;
  normalized: string;
  description?: string;
  color: string;
  projectId: string;
  workspaceId: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
