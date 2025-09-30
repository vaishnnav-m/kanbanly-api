import { injectable } from "tsyringe";
import { epicModel } from "../models/epic.model";
import { IEpic } from "../types/entities/IEpic";
import { IEpicRepository } from "../types/repository-interfaces/IEpicRepository";
import { BaseRepository } from "./base.repository";

@injectable()
export class EpicRepository
  extends BaseRepository<IEpic>
  implements IEpicRepository
{
  constructor() {
    super(epicModel);
  }
}
