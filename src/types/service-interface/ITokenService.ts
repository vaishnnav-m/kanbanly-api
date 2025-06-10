import { JwtPayload } from "jsonwebtoken";

export interface ITokenPayload extends JwtPayload {
  email: string;
  role?: string;
  isVerified?: boolean;
}

export interface ITokenService {
  generateEmailToken(payload: { email: string }): string;
  generateAccessToken(payload: ITokenPayload): string;
  verifyAccessToken(token: string): ITokenPayload | null;
  verifyEmailToken(token: string): { email: string } | null;
  generateRefreshToken(payload: ITokenPayload): string;
  verifyRefereshToken(token: string): ITokenPayload | null;
}
