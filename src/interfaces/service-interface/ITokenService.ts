import { JwtPayload } from "jsonwebtoken";

export interface ITokenPayload {
  userId: string;
  role: string;
  isVerified: boolean;
}

export interface ITokenService {
  generateAccessToken(payload: ITokenPayload): string;
  verifyAccessToken(token: string): JwtPayload | string;
  generateRefreshToken(payload: ITokenPayload): string;
  verifyRefereshToken(token: string): JwtPayload | string;
}
