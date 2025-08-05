import { IProject } from "../entities/IProject";
import { IWorkspaceMember } from "../entities/IWorkspaceMember";
import { IBaseRepository } from "./IBaseRepositroy";

export interface IProjectRepository extends IBaseRepository<IProject> {
//   getProjectByUsers(workspaceId:string,projectId:string): Promise<
//     Omit<IProject, "members"> & { members: IWorkspaceMember[] }
//   >;
}
