import { sprintModel } from "../models/sprint.model";
import { ISprint } from "../types/entities/ISprint";
import { ISprintRepository } from "../types/repository-interfaces/ISprintRepository";
import { BaseRepository } from "./base.repository";

export class SprintRepository
  extends BaseRepository<ISprint>
  implements ISprintRepository
{
  constructor() {
    super(sprintModel);
  }

  async count(projectId: string): Promise<number> {
    const result = await this.model.countDocuments({ projectId });
    return result;
  }
}
