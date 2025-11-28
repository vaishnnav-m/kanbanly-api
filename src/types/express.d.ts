import { Server } from "socket.io";
import { ITokenPayload } from "./service-interface/ITokenService";

declare module "express-serve-static-core" {
  interface Request {
    user?: ITokenPayload;
  }

  interface Application {
    io?: Server;
  }
}
