import jwt, { JwtPayload } from "jsonwebtoken";
import {
  ITokenPayload,
  ITokenService,
} from "../interfaces/service-interface/ITokenService";
import { config } from "../config";
import { injectable } from "tsyringe";

@injectable()
export class TokenService implements ITokenService {
  private _accessSecret: string;
  private _refreshSecret: string;
  constructor() {
    this._accessSecret = config.jwt.ACCESS_TOKEN_SECRET;
    this._refreshSecret = config.jwt.REFRESH_TOKEN_SECRET;
  }

  generateAccessToken(payload: ITokenPayload): string {
    return jwt.sign(payload, this._accessSecret, { expiresIn: "5m" });
  }
  generateRefreshToken(payload: ITokenPayload): string {
    return jwt.sign(payload, this._refreshSecret, { expiresIn: "7d" });
  }
  verifyAccessToken(token: string): JwtPayload | string {
    return jwt.verify(token, this._accessSecret);
  }
  verifyRefereshToken(token: string): JwtPayload | string {
    return jwt.verify(token, this._refreshSecret);
  }
}
