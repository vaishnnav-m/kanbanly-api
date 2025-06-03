import { JwtPayload } from "jsonwebtoken";

export interface ITokenPayload extends JwtPayload {
  userId: string;
  role: string;
  isVerified: boolean;
}

export interface ITokenService {
  generateAccessToken(payload: ITokenPayload): string;
  verifyAccessToken(token: string): ITokenPayload | null;
  generateRefreshToken(payload: ITokenPayload): string;
  verifyRefereshToken(token: string): JwtPayload | null;
}
