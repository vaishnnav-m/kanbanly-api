import { injectable } from "tsyringe";
import { projectModel } from "../models/project.model";
import { IProject } from "../types/entities/IProject";
import { IProjectRepository } from "../types/repository-interfaces/IProjectRepository";
import { BaseRepository } from "./base.repository";

@injectable()
export class ProjectRepository
  extends BaseRepository<IProject>
  implements IProjectRepository
{
  constructor() {
    super(projectModel);
  }
}
