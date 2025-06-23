import { JwtPayload } from "jsonwebtoken";

export interface ITokenPayload extends JwtPayload {
  userid: string;
  email: string;
  role?: string;
}

export interface ITokenService {
  generateEmailToken(payload: { email: string }): string;
  generateAccessToken(payload: ITokenPayload): string;
  verifyAccessToken(token: string): ITokenPayload | null;
  verifyEmailToken(token: string): { email: string } | null;
  generateRefreshToken(payload: ITokenPayload): string;
  verifyRefereshToken(token: string): ITokenPayload | null;
}
