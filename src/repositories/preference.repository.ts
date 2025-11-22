import { preferenceModel } from "../models/preference.model";
import { IPreference } from "../types/entities/IPreference";
import { IPreferenceRepository } from "../types/repository-interfaces/IPreferenceRepository";
import { BaseRepository } from "./base.repository";

export class PreferenceRepository
  extends BaseRepository<IPreference>
  implements IPreferenceRepository
{
  constructor() {
    super(preferenceModel);
  }
}
