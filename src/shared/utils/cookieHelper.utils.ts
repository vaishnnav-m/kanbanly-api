import { Response } from "express";
import { config } from "../../config";

const isProduction = process.env.NODE_ENV === "production";
const subDomain = config.cookies.SUB_DOMAIN;

export const setAuthCookies = (
  res: Response,
  key: string,
  value: string,
  maxAge?: number
) => {
  res.cookie(key, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge,
    ...(isProduction && subDomain && { domain: subDomain }),
  });
};

export const clearAuthCookies = (res: Response, key: string) => {
  res.clearCookie(key, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 0,
    ...(isProduction && subDomain && { domain: subDomain }),
  });
};
