import { injectable } from "tsyringe";
import { IBcryptUtils } from "../../types/common/IBcryptUtils";
import bcrypt from "bcrypt";

@injectable()
export class BcryptUtils implements IBcryptUtils {
  private readonly SALT_ROUNDS = 10;

  hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  compare(current: string, original: string): Promise<boolean> {
    return bcrypt.compare(current, original);
  }
}
