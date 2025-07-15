import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { HTTP_STATUS } from "../shared/constants/http.status";

export const zodValidate =
  <T extends ZodType>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, message: errors });
      return;
    }

    req.body = result.data;
    next();
  };
