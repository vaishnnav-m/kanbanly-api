import { Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

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
    ...(isProduction && { domain: ".vaishnnav.online" }),
  });
};

export const clearAuthCookies = (res: Response, key: string) => {
  res.clearCookie(key, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 0,
    ...(isProduction && { domain: ".vaishnnav.online" }),
  });
};
