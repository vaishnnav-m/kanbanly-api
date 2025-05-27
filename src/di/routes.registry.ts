import { container } from "tsyringe";
import { AuthRoutes } from "../routes/auth/auth.routes";

export class RoutesRegistry{
   static registerRoutes():void{
      container.register(AuthRoutes,{
         useClass:AuthRoutes
      })
   }
}
