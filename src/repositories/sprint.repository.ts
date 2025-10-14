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
}
