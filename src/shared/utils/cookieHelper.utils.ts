import { Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const setAuthCookies = (res: Response, key: string, value: string) => {
  res.cookie(key, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
};
