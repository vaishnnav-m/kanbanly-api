import { injectable } from "tsyringe";
import { planModel } from "../models/plan.model";
import { IPlan } from "../types/entities/IPlan";
import { IPlanRepository } from "../types/repository-interfaces/IPlanRepository";
import { BaseRepository } from "./base.repository";

@injectable()
export class PlanRepository
  extends BaseRepository<IPlan>
  implements IPlanRepository
{
  constructor() {
    super(planModel);
  }
}
