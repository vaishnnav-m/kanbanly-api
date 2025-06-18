import { injectable } from "tsyringe";
import { IGoogleUser } from "../types/common/IGoogleUserInfo";
import { IGoogleService } from "../types/service-interface/IGoogleService";
import { OAuth2Client } from "google-auth-library";
import { config } from "../config";
import axios from "axios";
import { HTTP_STATUS } from "../shared/constants/http.status";
import AppError from "../shared/utils/AppError";

@injectable()
export class GoogleService implements IGoogleService {
  private _client: OAuth2Client;
  constructor() {
    this._client = new OAuth2Client(config.googleAuth.CLIENT_ID);
  }

  async getUserInfoFromAccessToken(accessToken: string): Promise<IGoogleUser> {
    
    const tokenInfo = await this._client.getTokenInfo(accessToken);
    const profile = await axios.get(config.googleAuth.USERINFO_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!tokenInfo.sub || !tokenInfo.email) {
      throw new AppError(
        "Missing essential user data in token.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    return {
      googleId: tokenInfo.sub,
      email: tokenInfo.email,
      firstName: profile.data.given_name,
      lastName: profile.data.family_name,
      picture: profile.data.picture,
    };
  }
}
