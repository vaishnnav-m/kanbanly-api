import { injectable } from "tsyringe";
import { IWorkspaceMemberRepository } from "../types/repository-interfaces/IWorkspaceMember";
import { BaseRepository } from "./base.repository";
import { IWorkspaceMember } from "../types/entities/IWorkspaceMember";
import { workspaceMemberModel } from "../models/workspaceMembers.model";

@injectable()
export class WorkspaceMemberRepository
  extends BaseRepository<IWorkspaceMember>
  implements IWorkspaceMemberRepository
{
  constructor() {
    super(workspaceMemberModel);
  }
}
