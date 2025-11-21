import {
  PreferenceResponseDto,
  UpdatePreferenceDto,
} from "../dtos/preference/preference.dto";

export interface IPreferenceService {
  createPreferences(userId: string): Promise<void>;
  getUserPreferences(userId: string): Promise<PreferenceResponseDto>;
  updateUserPreferences(data: UpdatePreferenceDto): Promise<void>;
}
