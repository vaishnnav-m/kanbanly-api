import { container, FactoryProvider } from "tsyringe";
import { IBcryptUtils } from "../types/common/IBcryptUtils";
import { BcryptUtils } from "../shared/utils/password.utils";
import { ErrorMiddleware } from "../middlewares/error.middleware";
export class CommonRegistry {
  static registerCommon(): void {
    container.register<IBcryptUtils>("IBcryptUtils", {
      useClass: BcryptUtils,
    });
    container.register<ErrorMiddleware>("ErrorMiddleware", {
      useClass: ErrorMiddleware,
    });
  }
}
