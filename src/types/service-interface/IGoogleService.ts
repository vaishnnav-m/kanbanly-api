import { IGoogleUser } from "../common/IGoogleUserInfo";

export interface IGoogleService {
  getUserInfoFromAccessToken(accessToken: string): Promise<IGoogleUser>;
}
