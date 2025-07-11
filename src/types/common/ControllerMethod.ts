import { Request, Response } from "express";

export type controllerMethod = (req: Request, res: Response) => Promise<void>;
