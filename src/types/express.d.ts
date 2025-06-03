import { ITokenPayload } from "./service-interface/ITokenService";

declare module "express-serve-static-core" {
  interface Request {
    user?: ITokenPayload;
  }
}
